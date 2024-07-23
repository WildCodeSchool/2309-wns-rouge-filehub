import { Request, Response } from "express";
import AWS from "aws-sdk";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import { File } from "../entities/File";
import { UploadFileController } from "../controllers/UploadFile";

// Mock des modules externes
jest.mock("aws-sdk");
jest.mock("jsonwebtoken");
jest.mock("cookies");
jest.mock("../entities/File");

describe("UploadFileController", () => {
  let s3Mock: jest.Mocked<AWS.S3>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let uploadFileController: UploadFileController;

  beforeEach(() => {
    // Initialisation du mock S3 avec une fonction upload mockée
    s3Mock = new AWS.S3() as jest.Mocked<AWS.S3>;
    s3Mock.upload = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    }) as any;

    // Initialisation d'un objet request partiel avec des propriétés de fichier et de cookies
    req = {
      file: {
        originalname: "test.txt",
        buffer: Buffer.from("test content"),
        mimetype: "text/plain",
        size: 1234,
      },
      cookies: {
        token: "testtoken",
      },
    } as Partial<Request>;

    // Initialisation d'un objet response partiel avec des méthodes mockées
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>;

    // Mock de la vérification JWT pour renvoyer un userId
    jwt.verify = jest.fn().mockReturnValue({ userId: 1 });
    // Mock de la méthode get des cookies pour renvoyer un token
    Cookies.prototype.get = jest.fn().mockReturnValue("testtoken");

    // Création d'une instance mock de File avec une méthode save mockée
    const mockFileInstance = {
      save: jest.fn().mockResolvedValue({
        originalName: "test.txt",
        uniqueName: "unique-test.txt",
        mimeType: "text/plain",
        size: 1234,
        uploadAt: new Date(),
        url: "http://localhost:3000/downloads/unique-test.txt",
        createdBy: { id: 1 },
      }),
      originalName: "test.txt",
      uniqueName: "unique-test.txt",
      mimeType: "text/plain",
      size: 1234,
      uploadAt: new Date(),
      url: "http://localhost:3000/downloads/unique-test.txt",
      createdBy: { id: 1 },
    };
    // Mock de la méthode create de File pour renvoyer l'instance mockée
    File.create = jest.fn().mockReturnValue(mockFileInstance);

    // Initialisation du contrôleur avec le mock S3
    uploadFileController = new UploadFileController(s3Mock);
  });

  // Test pour vérifier l'upload réussi d'un fichier
  it("should upload a file successfully", async () => {
    // Appel de la méthode uploadSingleFile du contrôleur avec les objets req et res
    await uploadFileController.uploadSingleFile(
      req as Request,
      res as Response,
    );

    // Vérifier que la méthode upload de S3 a été appelée avec les bons arguments
    expect(s3Mock.upload).toHaveBeenCalledWith({
      Bucket: "bucket-filehub",
      Key: expect.any(String),
      Body: req.file!.buffer,
      ContentType: req.file!.mimetype,
    });

    // Vérifier que la méthode create de File a été appelée avec les bons arguments
    expect(File.create).toHaveBeenCalledWith(
      expect.objectContaining({
        originalName: "test.txt",
        uniqueName: expect.any(String),
        mimeType: "text/plain",
        size: 1234,
        uploadAt: expect.any(Date),
        url: expect.any(String),
        createdBy: { id: 1 },
      }),
    );

    // Vérification que la méthode send de res a été appelée avec les bons arguments
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        originalName: "test.txt",
        uniqueName: "unique-test.txt",
        mimeType: "text/plain",
        size: 1234,
        uploadAt: expect.any(Date),
        url: "http://localhost:3000/downloads/unique-test.txt",
        createdBy: { id: 1 },
      }),
    );
  });

  // Test pour vérifier la gestion des erreurs lors de l'upload
  it("should handle errors during file upload", async () => {
    // Mock de la méthode upload de S3 pour renvoyer une erreur
    s3Mock.upload = jest.fn().mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error("S3 error")),
    }) as any;

    // Appel de la méthode uploadSingleFile du contrôleur avec les objets req et res
    await uploadFileController.uploadSingleFile(
      req as Request,
      res as Response,
    );

    // Vérification que la méthode status de res a été appelée avec le code 500
    expect(res.status).toHaveBeenCalledWith(500);
    // Vérification que la méthode send de res a été appelée avec le message d'erreur
    expect(res.send).toHaveBeenCalledWith(
      "Erreur lors du téléchargement du fichier vers S3",
    );
  });
});
