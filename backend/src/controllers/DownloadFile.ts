import { Request, Response } from "express";
import AWS from "aws-sdk";

export class DownloadFileController {
  private s3: AWS.S3;

  constructor(s3: AWS.S3) {
    this.s3 = s3;
  }

  downloadingFile = async (req: Request, res: Response) => {
    try {
      const fileName = req.query.name as string;

      const params = {
        Bucket: "bucket-filehub",
        Key: fileName,
      };

      this.s3.getObject(params, (err: any, data: any) => {
        if (err) {
          res.status(500).send({
            message: "There was an issue in downloading the file. " + err,
          });
        } else {
          res.attachment(fileName);
          res.send(data.Body);
        }
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).send("An error occurred while downloading the file");
    }
  };
}
