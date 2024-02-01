import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Field, ID, ObjectType, InputType } from "type-graphql";
import { IsEmail, Matches } from "class-validator";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column({ length: 255 })
  hashedPassword!: string;

  @Column()
  createdAt!: Date;

  @OneToMany(() => File, (file) => file.createdBy)
  @Field(() => [File])
  files!: File[];
}

@InputType()
export class UserCreateInput {
  @Field()
  @IsEmail()
  email!: string;
  @Field()
  @Matches(/^.{8,50}$/)
  password!: string;
}

@InputType()
export class UserUpdateInput {
  @Field()
  @Matches(/^.{8,50}$/)
  password?: string;
}
