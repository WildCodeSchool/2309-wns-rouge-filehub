import { Request, Response } from "express";
import { File } from "../entities/File";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import { formatUrl } from "../helpers/FormatUrl";

export class UploadFileController {
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

      const { originalname, filename, mimetype, size, path } =
        req.file as Express.Multer.File;
      const newFile = File.create({
        originalName: decodeURIComponent(originalname),
        uniqueName: decodeURIComponent(filename),
        mimeType: mimetype,
        size: size,
        path: decodeURIComponent(path),
        uploadAt: new Date(),
        url: `${process.env.FRONT_ADRESS}/downloads/${decodeURIComponent(filename)}`,
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
