import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { User, UserCreateInput } from "../entities/User";
import { ContextType } from "../auth";

@Resolver(User)
export class UsersResolver {
  @Query(() => [User])
  async allUsers(): Promise<User[]> {
    return await User.find();
  }

  @Query(() => User, { nullable: true })
  async getOneUser(@Arg("id", () => ID) id: number): Promise<User | null> {
    return await User.findOne({
      where: {
        id: id,
      },
    });
  }

  @Mutation(() => User)
  async createUser(
    @Arg("data", () => UserCreateInput) data: UserCreateInput
  ): Promise<User> {
    try {
      const newUser = new User();
      Object.assign(newUser, data);
      //   newFile.uploadAt = new Date().toISOString().split("T")[0];
      await newUser.save();
      return newUser;
    } catch (error) {
      throw new Error(`An error occured: ${error}`);
    }
  }

  @Authorized()
  @Query(() => User)
  async me(@Ctx() context: ContextType): Promise<User> {
    return context.user as User;
  }
}
