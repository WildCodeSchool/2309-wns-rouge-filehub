import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, ObjectType, Int, InputType } from "type-graphql";
import { User } from "./User";
import { ObjectId } from "./ObjectId";

@Entity()
@ObjectType()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column({ length: 100 })
  @Field()
  name!: string;

  @Column({ length: 20 })
  @Field()
  type!: string;

  @Column()
  @Field(() => Int)
  size!: number;

  @Column({ length: 200 })
  @Field()
  url!: string;

  //   @Column()
  //   @Field()
  //   private!: Boolean;

  @CreateDateColumn()
  @Field()
  uploadAt!: Date;

  @ManyToOne(() => User, (user) => user.files)
  @Field(() => User)
  createdBy!: User;
}

@InputType()
export class FileCreateInput {
  @Field()
  name!: string;

  @Field()
  createdBy!: ObjectId;
}
