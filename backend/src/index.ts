import "reflect-metadata";
import { dataSource } from "./datasource";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { UsersResolver } from "./resolvers/Users";
import { ContextType, customAuthChecker } from "./auth";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { FilesResolver } from "./resolvers/Files";

async function start() {
  await dataSource.initialize();
  const schema = await buildSchema({
    resolvers: [UsersResolver, FilesResolver],
    authChecker: customAuthChecker,
  });

  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<ContextType>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
  });
  await server.start();

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
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({port: 5001}, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:5001/`);
}

start();
