import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { User, UserCreateInput, UserUpdateInput } from "../entities/User";
import { validate } from "class-validator";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import { ContextType, getUserFromReq } from "../auth";

@Resolver(User)
export class UsersResolver {
  @Query(() => [User])
  async allUsers(): Promise<User[]> {
    const users = await User.find({});
    return users;
  }

  @Query(() => User, { nullable: true })
  async user(@Arg("id", () => ID) id: number): Promise<User | null> {
    const user = await User.findOne({
      where: { id: id },
    });
    return user;
  }

  @Authorized()
  @Query(() => User, { nullable: true })
  async me(@Ctx() context: ContextType): Promise<User | null> {
    return getUserFromReq(context.req, context.res);
  }

  @Mutation(() => Boolean)
  async signout(@Ctx() context: ContextType): Promise<boolean> {
    const cookies = new Cookies(context.req, context.res);
    cookies.set("token", "", {
      httpOnly: true,
      secure: false,
      maxAge: 0,
    });
    return true;
  }

  @Mutation(() => User)
  async signup(
    @Arg("data", () => UserCreateInput) data: UserCreateInput,
  ): Promise<User> {
    const errors = await validate(data);
    if (errors.length !== 0) {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`);
    }

    const existingUser = await User.findOneBy({ email: data.email });
    if (existingUser) {
      throw new Error(`User already exist`);
    }

    const newUser = new User();
    const hashedPassword = await argon2.hash(data.password);
    Object.assign(newUser, {
      email: data.email,
      password: hashedPassword,
    });

    await newUser.save();
    return newUser;
  }

  @Mutation(() => User, { nullable: true })
  async signin(
    @Ctx() context: { req: any; res: any },
    @Arg("email") email: string,
    @Arg("password") password: string,
  ): Promise<User | null> {
    const existingUser = await User.findOneBy({ email });
    if (existingUser) {
      if (await argon2.verify(existingUser.password, password)) {
        const token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
            userId: existingUser.id,
          },
          process.env.JWT_SECRET || "supersecret",
        );

        const cookies = new Cookies(context.req, context.res);
        cookies.set("token", token, {
          httpOnly: true,
          secure: false,
          maxAge: 1000 * 60 * 60 * 24,
        });

        return existingUser;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  @Authorized()
  @Mutation(() => User)
  async updatePassword(
    @Ctx() context: ContextType,
    @Arg("data") data: UserUpdateInput,
  ): Promise<User | null> {
    if (data.newPassword1 !== data.newPassword2) {
      throw new Error(`Got 2 different new passwords...`);
    }
    if (data.newPassword1 === data.password) {
      throw new Error(`Unchanged password...`);
    }
    const targetUser = await User.findOne({
      where: { id: context.user?.id },
    });

    if (targetUser) {
      if (await argon2.verify(targetUser.password, data.password)) {
        console.log(
          "Changement du mot de passe de : " +
            data.password +
            " à : " +
            data.newPassword1,
        );
        const hashedPassword = await argon2.hash(data.newPassword1);
        targetUser.password = hashedPassword;
      } else {
        throw new Error(`Invalid password...`);
      }
    } else {
      throw new Error(`User not found`);
    }

    const errors = await validate(targetUser);
    if (errors.length === 0) {
      console.log("saving...");
      await targetUser.save();
      return await User.findOne({
        where: { id: context.user?.id },
      });
    } else {
      throw new Error(`Error occured : ${JSON.stringify(errors)}`);
    }
  }
}
