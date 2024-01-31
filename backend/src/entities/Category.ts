import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Field, ID, ObjectType, InputType } from "type-graphql";
import { Ad } from "./Ad";

@Entity()
@ObjectType()
export class Category extends BaseEntity{
    @PrimaryGeneratedColumn()
    @Field(()=> ID)
    id!: number;
    @Column()
    @Field()
    name!: string;
    @OneToMany(() => Ad, (ad) => ad.category)
    @Field(()=> [Ad])
    ads!:Ad[];
}

@InputType()
export class CategoryCreateInput{
    @Field()
    name!: string;
}

@InputType()
export class CategoryUpdateInput{
    @Field({ nullable: true })
    name!: string;
}