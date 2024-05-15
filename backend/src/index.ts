import "reflect-metadata";
import { dataSource } from "./datasource";
import { ApolloServer } from "@apollo/server";
import { ContextType } from "./auth";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express, { Request, Response, NextFunction } from "express";
import { expressMiddleware } from "@apollo/server/express4";
import http from "http";
import cors from "cors";
import multer from "multer";
import path from "path";
import { UploadFileController } from "./controllers/UploadFile";
import { DownloadFileController } from "./controllers/DownloadFile";
import { getSchema } from "./schema";
import { deleteOrphanFiles } from "./cron/deleteOrphanFiles";
import AWS from "aws-sdk";

async function start() {
  await dataSource.initialize();

  const schema = await getSchema();

  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  );

  const httpServer = http.createServer(app);
  const server = new ApolloServer<ContextType>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    csrfPrevention: { requestHeaders: ["multipart/form-data"] },
  });
  await server.start();

  // Configuration de Minio
  const localSetup = {
    endpoint: "http://minio-local:9000",
    accessKeyId: "mW2GGADINBj7n60MZZ3H",
    secretAccessKey: "YmaJNb4U9ltQAqssfsWMbhnNXA5vWMSEAp3N79Di",
    sslEnabled: false,
    s3ForcePathStyle: true,
  };
  const awsBucket = new AWS.S3(localSetup);

  // MIDDLEWARE MULTER QUI TRAITE LES FICHIERS ENTRE LE FRONT ET LE SERVEUR

  const storage = multer.memoryStorage(); // Utilisation de la mémoire pour stocker les fichiers temporairement

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  app.use("/files", express.static(path.join(__dirname, "uploads")));

  // CONTROLLERS

  const uploadFileController = new UploadFileController(awsBucket);
  const downloadFileController = new DownloadFileController(awsBucket);

  app.post(
    `${process.env.ROOT_PATH}/upload`,
    upload.single("file"),
    uploadFileController.uploadSingleFile,
  );

  app.get(`${process.env.ROOT_PATH}/download`, function (req, res) {
    downloadFileController.downloadingFile(req, res);
  });

  app.use(
    "/",
    cors<cors.CorsRequest>({
      origin: "http://localhost:3000",
      credentials: true,
    }),
    express.json({ limit: "50mb" }),
    expressMiddleware(server, {
      context: async (args) => {
        return {
          req: args.req,
          res: args.res,
        };
      },
    }),
  );

  // Error handling middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("An error occurred:", err);
    res.status(500).send("An internal server error occurred");
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 5001 }, resolve),
  );
  console.log(`🚀 Server ready at http://localhost:5001/`);
  deleteOrphanFiles();
}

start();
