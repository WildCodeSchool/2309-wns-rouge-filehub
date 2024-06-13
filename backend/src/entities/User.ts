import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
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

  @Column({ length: 255, unique: true })
  @Field()
  email!: string;

  @Column({ length: 255 })
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  verified!: Boolean;

  // @OneToMany(() => File, (file) => file.createdBy)
  // @Field(() => [File])
  // files!: File[];
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
  password!: string;
  @Field()
  @Matches(/^.{8,50}$/)
  newPassword1!: string;
  @Field()
  @Matches(/^.{8,50}$/)
  newPassword2!: string;
}