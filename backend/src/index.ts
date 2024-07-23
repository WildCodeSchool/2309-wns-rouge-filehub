import "reflect-metadata";
import { dataSource } from "./datasource";
import { ApolloServer } from "@apollo/server";
import { ContextType } from "./auth";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express, { request, response } from "express";
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
import Stripe from "stripe";
import { Plan, User } from "./entities/User";
import { stripe } from "./stripe";

async function start() {
  await dataSource.initialize(); // Initialisation de la connexion à la base de données

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

  const localSetupMinio = {
    endpoint: process.env.MINIO_ENDPOINT,
    accessKeyId: process.env.MINIO_ROOT_USER,
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD,
    sslEnabled: false,
    s3ForcePathStyle: true,
  };

  const awsBucket = new AWS.S3(localSetupMinio);

  // MIDDLEWARE MULTER QUI TRAITE LES FICHIERS ENTRE LE FRONT ET LE SERVEUR

  const storage = multer.memoryStorage();

  const upload = multer({
    storage: storage,
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

  app.post(
    `${process.env.ROOT_PATH}/webhook`,
    express.json(),
    async (req, res) => {
      const sig = request.headers["Stripe-Signature"];
      if (!sig || !process.env.STRIPE_SECRET_KEY) {
        return res
          .status(400)
          .send("Webhook Error: Missing signature or endpoint secret");
      }

      let event = req.body as Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          sig,
          process.env.STRIPE_SECRET_KEY,
        );
      } catch (err) {
        response.status(400).send(`Webhook Error`);
      }

      // Handle the event
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const stripeCustomerId = session.customer;
          if (typeof stripeCustomerId !== "string") {
            return null;
          }
          const user = await User.findOneBy({ stripeCustomerId });
          if (!user) {
            return res.status(404).send("User not found");
          }
          user.plan = Plan.PREMIUM;
          await user.save();
          console.log(`Checkout session ${session.id} was completed!`);
          break;
        }
        case "invoice.paid": {
          const invoice = event.data.object as Stripe.Invoice;
          const stripeCustomerId = invoice.customer;
          if (typeof stripeCustomerId !== "string") {
            return null;
          }
          const user = await User.findOneBy({ stripeCustomerId });
          if (!user) {
            return res.status(404).send("User not found");
          }
          user.plan = Plan.PREMIUM;
          await user.save();
          console.log(`Invoice ${invoice.id} was paid!`);
          break;
        }
        case "invoice.payment_failed": {
          const invoice = event.data.object as Stripe.Invoice;
          const stripeCustomerId = invoice.customer;
          if (typeof stripeCustomerId !== "string") {
            return null;
          }
          const user = await User.findOneBy({ stripeCustomerId });
          if (!user) {
            return res.status(404).send("User not found");
          }
          console.log(`Invoice ${invoice.id} payment failed.`);
          break;
        }
        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          const stripeCustomerId = subscription.customer;
          if (typeof stripeCustomerId !== "string") {
            return null;
          }
          const user = await User.findOneBy({ stripeCustomerId });
          if (!user) {
            return res.status(404).send("User not found");
          }
          user.plan = Plan.FREE;
          await user.save();
          console.log(`Subscription ${subscription.id} was deleted.`);
          break;
        }
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      res.status(200).send("OK");
    },
  );

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

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 5001 }, resolve),
  );
  console.log(`🚀 Server ready at http://localhost:5001/`);
  deleteOrphanFiles();
}

start();
