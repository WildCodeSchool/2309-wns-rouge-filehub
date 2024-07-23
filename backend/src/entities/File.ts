import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import { ObjectId } from "./ObjectId";
import { User } from "./User";

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
  url!: string;

  @CreateDateColumn()
  @Field()
  uploadAt!: Date;

  @ManyToOne(() => User, (User) => User.id, { nullable: false })
  @Field(() => User)
  createdBy!: User;
}

@InputType()
export class FilesWhere {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  originalName?: string;

  @Field({ nullable: true })
  uniqueName?: string;

  @Field({ nullable: true })
  mimeType?: string;

  @Field(() => Int, { nullable: true })
  size?: number;

  @Field({ nullable: true })
  url?: string;

  @Field(() => Int, { nullable: true })
  createdBy?: Number;
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
