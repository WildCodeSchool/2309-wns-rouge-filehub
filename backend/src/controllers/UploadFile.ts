import { Request, Response } from 'express';
import { File } from '../entities/File';

export class UploadFileController {
  uploadSingleFile = async (req: Request, res: Response) => {
    try {
      const { originalname, mimetype, size, path } =
        req.file as Express.Multer.File;
      const newFile = File.create({
        name: originalname,
        mimeType: mimetype,
        size: size,
        path: path,
        uploadAt: new Date(),
        url: '',
      });

      await newFile.save();

      res.send(newFile);
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('An error occurred while uploading the file');
    }
  };
}
