import {BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import { Category } from "./Category";
import { Tag } from "./Tag"
import { Length } from "class-validator";
import { ObjectId } from "./ObjectId";
import { User } from "./User";

@Entity()
@ObjectType()
export class Ad extends BaseEntity{
    @PrimaryGeneratedColumn()
    @Field(()=> ID)
    id!: number;

    @Column({length: 100})
    @Length(3, 100)
    @Field()
    title!: string;

    @Column()
    @Length(3, 2000)
    @Field()
    description!: string;

    @Column({length: 100})
    @Length(3, 50)
    @Field()
    owner!: string;

    @Column()
    @Field()
    price!: number;

    @Column({nullable: true, length: 300})
    @Field()
    picture!: string;

    @Column({length: 100})
    @Length(3, 50)
    @Field()
    location!: string;

    @Column()
    @Field()
    createdAt!: Date;

    @ManyToOne(() => Category, (Category) => Category.ads)
    @Field(()=> Category)
    category!: Category;

    @ManyToMany(()=> Tag, (tag) => tag.ads)
    @JoinTable()
    @Field(()=> [Tag])
    tags!: Tag[];

    @ManyToOne(() => User, (user) => user.ads)
    @Field(()=> User)
    createdBy!: User;
}

@InputType()
export class AdCreateInput{
    @Field()
    title!: string;
    @Field()
    description!: string;
    @Field()
    owner!: string;
    @Field()
    price!: number;
    @Field()
    picture!: string;
    @Field()
    location!: string;
    @Field()
    category!: ObjectId;
    @Field(()=> [ObjectId], {nullable: true})
    tags!: ObjectId[];
}

@InputType()
export class AdUpdateInput{
    @Field({ nullable: true })
    title!: string;
    @Field({ nullable: true })
    description!: string;
    @Field({ nullable: true })
    owner!: string;
    @Field({ nullable: true })
    price!: number;
    @Field({ nullable: true })
    picture!: string;
    @Field({ nullable: true })
    location!: string;
    @Field({ nullable: true })
    category!: ObjectId;
    @Field(()=> [ObjectId], {nullable: true})
    tags!: ObjectId[];
}

@InputType()
export class AdsWhere {
  @Field(() => [ID], { nullable: true })
  categoryIn?: number[];

  @Field(() => String, { nullable: true })
  searchTitle?: string;

  @Field(() => Int, { nullable: true })
  priceGte?: number;

  @Field(() => Int, { nullable: true })
  priceLte?: number;
}