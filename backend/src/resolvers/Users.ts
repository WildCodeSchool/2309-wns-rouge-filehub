import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { validate } from "class-validator";
import { User, UserCreateInput } from "../entities/User";
import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
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

    @Mutation(() => User)
    async signUp(@Arg("data", () => UserCreateInput) data: UserCreateInput): Promise<User | null> {
        const newUser = new User();
        Object.assign(newUser, {
            email: data.email,
            hashedPassword: await hash(data.password)
        });
        const errors = await validate(newUser);
        if (errors.length === 0) {
            const existingUser = await User.findOneBy({email: data.email});
            if(existingUser){
                throw new Error(`User already exist!`);
            }
            await newUser.save();
            return (newUser);
            } else {
            throw new Error(`Error occured : ${JSON.stringify(errors)}`)
        }
    }

    @Mutation(() => User, {nullable: true})
    async signIn(@Ctx() context: {req: any, res: any},
        @Arg("data", () => UserCreateInput) data: UserCreateInput): Promise<User | null> {
        const existingUser = await User.findOneBy({email: data.email});
        
        if(existingUser){
            if(await verify(existingUser.hashedPassword, data.password)){
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 20,
                    userId: existingUser.id
                },
                process.env.JWT_SECRET||"test");
                console.log(token);
                const cookies = new Cookies(context.req, context.res);
                cookies.set("token", token, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 1000*60*60*24
                })

                return existingUser;
            } else {
                throw new Error("Connexion échouée");
            }
        } else {
            throw new Error("Connexion échouée");
        }
    }

    @Mutation(() => Boolean)
    async signOut(@Ctx() context: {req: any, res: any}): Promise<boolean> {
        const cookies = new Cookies(context.req, context.res);
        cookies.set("token", "", {
            httpOnly: true,
            secure: false,
            maxAge: 0
        })
        return true;
    }
}