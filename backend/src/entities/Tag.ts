import {BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import { Field, ID, ObjectType, InputType } from "type-graphql";
import {Ad} from "./Ad";

@Entity()
@ObjectType()
export class Tag extends BaseEntity{
    @PrimaryGeneratedColumn()
    @Field(()=> ID)
    id!: number;
    @Column()
    @Field()
    name!: string;
    @ManyToMany(() => Ad, (ad) => ad.tags)
    @Field(()=> [Ad])
    ads!: Ad[];
}

@InputType()
export class TagCreateInput{
    @Field()
    name!: string;
}

@InputType()
export class TagUpdateInput{
    @Field({ nullable: true })
    name!: string;
}