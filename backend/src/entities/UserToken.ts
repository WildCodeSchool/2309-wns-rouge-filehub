import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
  
import { ObjectType } from "type-graphql";
import { User } from "./User";
  
@Entity()
@ObjectType()
export class UserToken extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({ length: 255 })
    token!: string;
  
    @Column()
    expiresAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;
    
    @ManyToOne(() => User)
    user!: User;
}