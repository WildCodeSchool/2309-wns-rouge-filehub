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
  endpoint: process.env.AWS_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
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
      const awsBucket = new AWS.S3(localSetupMinio);
      try {
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
