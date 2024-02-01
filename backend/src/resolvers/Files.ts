import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { File, FileCreateInput } from "../entities/File";
import { ContextType } from "../auth";

@Resolver(File)
export class FilesResolver {
  @Query(() => [File])
  async allFiles(): Promise<File[]> {
    const files = await File.find();
    return files;
  }

  @Mutation(() => File)
  async createFile(
    @Arg("data", () => FileCreateInput) data: FileCreateInput
  ): Promise<File> {
    try {
      const newFile = new File();
      Object.assign(newFile, data);
      newFile.size = 20;
      newFile.type = "mb";
      newFile.url = "essaiurl";
      newFile.uploadAt = new Date();
      await newFile.save();
      return newFile;
    } catch (error) {
      throw new Error(`An error occured: ${error}`);
    }
  }
}
