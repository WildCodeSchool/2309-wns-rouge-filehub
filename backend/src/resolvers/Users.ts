import { Arg, Authorized, Ctx, ID, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { ContextType } from "../auth";

@Resolver(User)
export class UsersResolver {
    @Query(()=>[User])
    async allUsers(): Promise<User[]> {
        return await User.find();
    }

    @Query(()=> User, {nullable: true})
    async getOneUser(@Arg("id", () => ID) id: number): Promise<User | null> {
      return await User.findOne({where:{
        id: id
      }});
    }

    @Authorized()
    @Query(()=> User)
    async me(@Ctx() context : ContextType): Promise<User> {
        return context.user as User;
    }
}