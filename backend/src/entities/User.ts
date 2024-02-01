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

    @Column({length: 255})
    CreatedAt!:Timestamp
}

@InputType()
export class UserCreateInput{
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