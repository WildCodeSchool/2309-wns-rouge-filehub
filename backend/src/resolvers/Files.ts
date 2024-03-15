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
import fs from "fs";

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
  async getFile(@Arg('uniqueName') uniqueName: string): Promise<File | null> {
    const file = await File.findOne({
      where: { uniqueName },
    });
    return file;
  }

  @Authorized()
  @Mutation(() => File, { nullable: true })
  async deleteFile(@Arg('id', () => ID) id: number) {
    const file = await File.findOne({
      where: { id: id },
    });
    if (file) {
      await file.remove();
      file.id = id;
      try {
        await fs.promises.unlink(file.path);
      } catch (err) {
        throw new Error(`An error occured on the actual file deletion: ${err}`);
      }
    } else {
      throw new Error(`File not found in database`);
    }
  }

  // @Authorized()
  // @Query(() => [File])
  // async filesByFilter(
  //   @Arg('data', () => FilesWhere) data: FilesWhere
  // ): Promise<File[]> {
  //   const queryWhere: any = {};

  //   queryWhere.id = data?.id;
  //   queryWhere.originalName = data?.originalName;
  //   queryWhere.uniqueName = data?.uniqueName;
  //   queryWhere.path = data?.path;
  //   queryWhere.mimeType = data?.mimeType;
  //   queryWhere.size = data?.size;
  //   queryWhere.url = data?.url;
  //   queryWhere.createdBy = { id: data?.createdBy };

  //   const files = await File.find({
  //     where: queryWhere,
  //     relations: {
  //       createdBy: true,
  //     },
  //   });
  //   return files;
  // }

  // @Authorized()
  // @Mutation(() => File, { nullable: true })
  // async updateFile(
  //   @Arg('id', () => ID) id: number,
  //   @Arg('data') data: FileUpdateInput
  // ): Promise<File | null> {
  //   const file = await File.findOne({
  //     where: { id: id },
  //   });
  //   if (file) {
  //     Object.assign(file, data);
  //     const errors = await validate(file);
  //     if (errors.length === 0) {
  //       await file.save();
  //     } else {
  //       throw new Error(`Error occured : ${JSON.stringify(errors)}`);
  //     }
  //   }
  //   return file;
  // }
}
