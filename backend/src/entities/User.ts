import {BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp} from "typeorm";
import { Field, ID, ObjectType, InputType } from "type-graphql";
import { IsEmail, Matches } from "class-validator";

@Entity()
@ObjectType()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    @Field(()=> ID)
    id!: number;
    
    @Column({length: 255, unique: true})
    @Field()
    @IsEmail()
    email!: string;

    @Column({length: 255})
    hashedPassword!: string;

    @Column()
    createdAt!: Date
}

@InputType()
export class UserCreateInput{
    @Field()
    @IsEmail()
    email!: string;
    @Field()
    @Matches(/^.{8,50}$/)
    password!: string;
}

@InputType()
export class UserUpdateInput{
    @Field()
    @Matches(/^.{8,50}$/)
    password?: string;
}