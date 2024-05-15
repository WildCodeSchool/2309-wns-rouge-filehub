import { Request, Response } from "express";
import { File } from "../entities/File";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import AWS from "aws-sdk";

export class UploadFileController {
  private s3: AWS.S3;

  constructor(s3: AWS.S3) {
    this.s3 = s3;
  }

  uploadSingleFile = async (req: Request, res: Response) => {
    try {
      let userId = 0;
      const cookies = new Cookies(req, res);
      if (cookies) {
        const token = cookies.get("token");
        if (token) {
          const payload = jwt.verify(
            token,
            process.env.JWT_SECRET || "supersecret",
          );
          if (typeof payload === "object" && "userId" in payload) {
            userId = payload.userId;
          }
        }
      }

      const { originalname, buffer, mimetype, size } =
        req.file as Express.Multer.File;

      const params = {
        Bucket: "bucket-filehub",
        Key: Date.now() + decodeURIComponent(originalname),
        Body: buffer,
        ContentType: mimetype,
      };

      const uploadResult = await this.s3.upload(params).promise();

      const newFile = File.create({
        originalName: decodeURIComponent(originalname),
        uniqueName: params.Key,
        mimeType: mimetype,
        size: size,
        path: params.Key,
        uploadAt: new Date(),
        url: uploadResult.Location,
        createdBy: { id: userId },
      });

      await newFile.save();

      res.send(newFile);
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).send("An error occurred while uploading the file");
    }
  };
}
