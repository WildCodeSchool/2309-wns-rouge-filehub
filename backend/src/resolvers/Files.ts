import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql';
import { File, FileCreateInput, FileUpdateInput } from '../entities/File';
import { validate } from 'class-validator';

@Resolver(File)
export class FilesResolver {
  @Query(() => [File])
  async allFiles(): Promise<File[]> {
    const files = await File.find();
    return files;
  }

  @Query(() => File)
  async getFile(@Arg('uniqueName') uniqueName: string): Promise<File | null> {
    const file = await File.findOne({
      where: { uniqueName },
    });
    return file;
  }

  @Mutation(() => File, { nullable: true })
  async deleteFile(@Arg('id', () => ID) id: number): Promise<File | null> {
    const file = await File.findOne({
      where: { id: id },
    });
    if (file) {
      await file.remove();
      file.id = id;
    }
    return file;
  }

  @Mutation(() => File, { nullable: true })
  async updateFile(
    @Arg('id', () => ID) id: number,
    @Arg('data') data: FileUpdateInput
  ): Promise<File | null> {
    const file = await File.findOne({
      where: { id: id },
    });
    if (file) {
      Object.assign(file, data);
      const errors = await validate(file);
      if (errors.length === 0) {
        await file.save();
      } else {
        throw new Error(`Error occured : ${JSON.stringify(errors)}`);
      }
    }
    return file;
  }
}
