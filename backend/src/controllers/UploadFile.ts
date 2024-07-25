import { Request, Response } from "express";
import { File } from "../entities/File";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import AWS from "aws-sdk";

export class UploadFileController {
  // Instance du client AWS S3
  private s3: AWS.S3;

  // Constructeur de la classe UploadFileController, qui initialise l'instance S3
  constructor(s3: AWS.S3) {
    this.s3 = s3;
  }

  // Méthode pour uploader un fichier unique
  uploadSingleFile = async (req: Request, res: Response) => {
    try {
      // Initialisation de l'identifiant utilisateur à 0
      let userId = 0;
      // Création d'une instance de Cookies pour accéder aux cookies de la requête
      const cookies = new Cookies(req, res);

      const token = cookies.get("token");
      if (!token) {
        return res.status(401).send("Aucun token fourni");
      }

      let payload;
      try {
        payload = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
      } catch (error) {
        return res.status(401).send("token invalide");
      }

      if (typeof payload === "object" && "userId" in payload) {
        userId = payload.userId;
      } else {
        return res.status(401).send("Contenu du token invalide");
      }

      if (!req.file) {
        return res.status(400).send("Aucun fichier téléchargé");
      }

      const { originalname, buffer, mimetype, size } =
        req.file as Express.Multer.File;

      // Vérifier la taille du fichier
      const maxFileSize = 10 * 1024 * 1024; // 10 MB
      if (size > maxFileSize) {
        return res
          .status(413)
          .send("La taille du fichier dépasse la limite de 10 Mo");
      }

      // Paramètres pour l'upload vers S3
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME || "bucket-filehub",
        Key: Date.now() + "-" + decodeURIComponent(originalname),
        Body: buffer,
        ContentType: mimetype,
      };

      try {
        await this.s3.upload(params).promise();
      } catch (error) {
        console.error("Erreur lors du téléchargement vers S3:", error);
        return res
          .status(500)
          .send("Erreur lors du téléchargement du fichier vers S3");
      }

      // Création d'une nouvelle instance de File avec les métadonnées du fichier
      const newFile = File.create({
        originalName: decodeURIComponent(originalname),
        uniqueName: params.Key,
        mimeType: mimetype,
        size: size,
        uploadAt: new Date(),
        url: `${process.env.FRONT_ADRESS}/downloads/${params.Key}`,
        createdBy: { id: userId },
      });

      try {
        await newFile.save();
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du fichier:", error);
        return res
          .status(500)
          .send(
            "Erreur lors de l'enregistrement du fichier dans la base de données",
          );
      }

      // Envoi de la réponse avec les métadonnées du fichier sauvegardé
      res.send(newFile);
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier:", error);
      res
        .status(500)
        .send("Une erreur s'est produite lors du téléchargement du fichier");
    }
  };
}
