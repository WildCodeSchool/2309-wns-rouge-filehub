import 'reflect-metadata';
import { dataSource } from './datasource';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from '@apollo/server';
import { UsersResolver } from './resolvers/Users';
import { ContextType, customAuthChecker } from './auth';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express, { Request } from 'express';
import http from 'http';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { FilesResolver } from './resolvers/Files';
import { UploadFileController } from './controllers/UploadFile';

async function start() {
  await dataSource.initialize();
  const schema = await buildSchema({
    resolvers: [UsersResolver, FilesResolver],
    authChecker: customAuthChecker,
  });

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
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  // UPLOAD FILE

  const uploadFileController = new UploadFileController();
  app.post(
    '/upload',
    upload.single('file'),
    uploadFileController.uploadSingleFile
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 5001 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:5001/`);
}

start();
