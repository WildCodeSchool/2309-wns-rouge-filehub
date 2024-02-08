import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, InputType, Int, ObjectType } from 'type-graphql';
import { ObjectId } from './ObjectId';

@Entity()
@ObjectType()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column({ length: 255 })
  @Field()
  originalName!: string;

  @Column({ length: 255 })
  @Field()
  uniqueName!: string;

  @Column({ length: 255 })
  @Field()
  mimeType!: string;

  @Column()
  @Field(() => Int)
  size!: number;

  @Column({ length: 255 })
  @Field()
  path!: string;

  @Column({ length: 255 })
  @Field()
  url!: string;

  @CreateDateColumn()
  @Field()
  uploadAt!: Date;
}

@InputType()
export class FileCreateInput {
  @Field()
  name!: string;

  @Field()
  createdBy!: ObjectId;
}

@InputType()
export class FileUpdateInput {
  @Field()
  name!: string;
}
