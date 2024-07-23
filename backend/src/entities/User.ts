import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Field, ID, ObjectType, InputType } from "type-graphql";
import { IsEmail, Matches } from "class-validator";

export enum Plan {
  FREE = "FREE",
  PREMIUM = "PREMIUM",
}

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

  @Column({ length: 255 })
  @Field()
  stripeCustomerId!: string;

  @Column({ default: Plan.FREE })
  @Field()
  plan!: Plan;

  @CreateDateColumn()
  createdAt!: Date;

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
  // @Field(() => Plan, { nullable: true })
  // plan?: Plan;
}
