import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { File } from "../entities/File";
import { ContextType } from "../auth";
import AWS from "aws-sdk";

const localSetupMinio = {
  endpoint: process.env.MINIO_ENDPOINT,
  accessKeyId: process.env.MINIO_ACCESS_KEY,
  secretAccessKey: process.env.MINIO_SECRET_KEY,
  sslEnabled: false,
  s3ForcePathStyle: true,
};

@Resolver(File)
export class FilesResolver {
  @Authorized()
  @Query(() => [File])
  async filesCurrentUser(@Ctx() context: ContextType): Promise<File[]> {
    const files = await File.find({
      where: { createdBy: { id: context?.user?.id } },
      relations: {
        createdBy: true,
      },
    });
    return files;
  }

  @Query(() => File)
  async getFile(@Arg("uniqueName") uniqueName: string): Promise<File | null> {
    const file = await File.findOne({
      where: { uniqueName },
    });
    return file;
  }

  @Authorized()
  @Mutation(() => File, { nullable: true })
  async deleteFile(@Arg("id", () => ID) id: number) {
    const file = await File.findOne({
      where: { id: id },
    });

    if (file) {
      try {
        const awsBucket = new AWS.S3(localSetupMinio);
        const params = {
          Bucket: "bucket-filehub",
          Key: file.uniqueName,
        };
        await awsBucket.deleteObject(params).promise();
        await file.remove();
      } catch (err) {
        throw new Error(
          `Une erreur s'est produite lors de la suppression du fichier : ${err}`,
        );
      }
    } else {
      throw new Error(`Fichier non trouvé dans la base de données`);
    }
  }
}
