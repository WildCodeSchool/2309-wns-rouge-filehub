import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, ObjectType, Int } from "type-graphql";
import { User } from "./User";

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

  @Column({ length: 100 })
  @Field(() => Int)
  size!: number;

  @Column({ length: 200 })
  @Field()
  url!: string;

  @Column()
  @Field()
  private!: Boolean;

  @CreateDateColumn()
  @Field()
  uploadAt!: Date;

  @ManyToOne(() => User, (user) => user.files)
  @Field(() => User)
  createdBy!: User;
}
