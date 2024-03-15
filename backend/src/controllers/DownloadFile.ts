import { Request, Response } from "express";
import path from "path";

export class DownloadFileController {
  downloadingFile = async (req: Request, res: Response) => {
    try {
      const fileName = req.query.name as string;
      const filePath = path.join(__dirname, "../Files", fileName);
      res.download(filePath, fileName, (err) => {
        if (err) {
          res.status(500).send({
            message: "There was an issue in downloading the file. " + err,
          });
        }
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).send("An error occurred while downloading the file");
    }
  };
}
