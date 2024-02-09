import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql';
import { File, FileCreateInput, FileUpdateInput, FilesWhere } from '../entities/File';
import { validate } from 'class-validator';
import { ContextType } from '../auth';

@Resolver(File)
export class FilesResolver {
  @Authorized()
  @Query(() => [File])
  async allFiles(): Promise<File[]> {
    const files = await File.find({relations : {
      createdBy: true
    },});
    return files;
  }

  @Authorized()
  @Query(() => [File])
  async filesByFilter(@Arg('data', () => FilesWhere) data: FilesWhere): Promise<File[]> {
    const queryWhere: any = {};

    queryWhere.id = data?.id;
    queryWhere.name = data?.name;
    queryWhere.path = data?.path;
    queryWhere.mimeType = data?.mimeType;
    queryWhere.size = data?.size;
    queryWhere.url = data?.url;
    queryWhere.createdBy =  {id: data?.createdBy};

    const files = await File.find({
      where: queryWhere,
      relations : {
      createdBy: true
    },});
    return files;
  }

  @Authorized()
  @Query(() => [File])
  async filesCurrentUser(@Ctx() context: ContextType): Promise<File[]> {

    const files = await File.find({
      where: { createdBy: { id: context?.user?.id } },
      relations : {
      createdBy: true
    },});
    return files;
  }

  @Authorized()
  @Mutation(() => File)
  async createFile(
    @Arg('data', () => FileCreateInput) data: FileCreateInput
  ): Promise<File> {
    try {
      const newFile = new File();
      Object.assign(newFile, data);
      newFile.size = 20;
      newFile.mimeType = 'mb';
      newFile.url = 'essaiurl';
      newFile.uploadAt = new Date();
      await newFile.save();
      return newFile;
    } catch (error) {
      throw new Error(`An error occured: ${error}`);
    }
  }

  @Authorized()
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

  @Authorized()
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
