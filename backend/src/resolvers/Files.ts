import {
  Arg,
  Authorized,
  Ctx,
  Field,
  ID,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { File } from "../entities/File";
import { ContextType } from "../auth";
import AWS from "aws-sdk";

const localSetupMinio = {
  endpoint: process.env.MINIO_ENDPOINT,
  accessKeyId: process.env.MINIO_ROOT_USER,
  secretAccessKey: process.env.MINIO_ROOT_PASSWORD,
  sslEnabled: false,
  s3ForcePathStyle: true,
};

@ObjectType()
class FilesResponse {
  @Field(() => [File])
  files!: File[];

  @Field(() => Int)
  total!: number;
}

@Resolver(File)
export class FilesResolver {
  // Permet de retourner une liste de fichiers paginée ainsi que le nombre total d'items
  @Authorized()
  @Query(() => FilesResponse)
  async filesCurrentUser(
    @Ctx() context: ContextType,
    @Arg("limit", () => Int, { nullable: true }) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number,
    @Arg("sortOrder", () => String, { nullable: true, defaultValue: "DESC" })
    sortOrder: "DESC" | "ASC" | "asc" | "desc",
  ): Promise<FilesResponse> {
    const order = { uploadAt: sortOrder };
    const [files, total] = await File.findAndCount({
      where: { createdBy: { id: context?.user?.id } },
      relations: {
        createdBy: true,
      },
      take: limit,
      skip: offset,
      order,
    });
    return { files, total };
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
