import 'reflect-metadata';
import { dataSource } from './datasource';
import { ApolloServer } from '@apollo/server';
import { ContextType } from './auth';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express, { Request } from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import http from 'http';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { UploadFileController } from './controllers/UploadFile';
import { DownloadFileController } from './controllers/DownloadFile';
import { getSchema } from './schema';

asynca function start() {
  await dataSource.initialize();

  const schema = await getSchema();

  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );

  const httpServer = http.createServer(app);
  const server = new ApolloServer<ContextType>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  // MIDDLEWARE MULTER QUI TRAITE LES FICHIERS ENTRE LE FRONT ET LE SERVEUR

  const storage = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) => {
      cb(null, path.join(__dirname, 'Files'));
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ) => {
      cb(null, Date.now() + file.originalname);
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  app.use('/files', express.static(path.join(__dirname, 'uploads')));

  // CONTROLLERS

  const uploadFileController = new UploadFileController();
  const downloadFileController = new DownloadFileController();

  app.post(
    '/upload',
    upload.single('file'),
    uploadFileController.uploadSingleFile
  );

  app.get('/download', function (req, res) {
    downloadFileController.downloadingFile(req, res);
  });

  app.use(
    '/',
    cors<cors.CorsRequest>({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
    // 50mb is the limit that `startStandaloneServer` uses, but you may configure this to suit your needs
    express.json({ limit: '50mb' }),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async (args) => {
        return {
          req: args.req,
          res: args.res,
        };
      },
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 5001 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:5001/`);
}

start();
