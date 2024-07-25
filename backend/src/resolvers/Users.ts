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
import nodemailer from "nodemailer";
import { UserToken } from "../entities/UserToken";
import { uuid } from "uuidv4";
import { stripe } from "../stripe";

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

  // utility function called when an email is to be sent
  async sendEmail(target: string, title: string, html: string) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "filehubwcs@gmail.com",
        pass: "ptom oitf kvmz oucz",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: "filehubwcs@gmail.com",
      to: target,
      subject: title,
      html: html,
    };

    try {
      transporter.sendMail(mailOptions);
    } catch (e) {
      throw new Error(String(e));
    }
  }

  // mutation called when the user want to get a new email and generate a new token to verify his account
  @Mutation(() => String)
  async sendVerifCode(
    @Arg("email", () => String) email: string,
  ): Promise<String> {
    try {
      const user = await User.findOne({
        where: { email: email },
      });
      if (user) {
        const token = new UserToken();
        token.user = user;
        token.createdAt = new Date();
        token.expiresAt = new Date(Number(token.createdAt) + 1000 * 60 * 60);
        token.token = uuid();
        await token.save();

        await this.sendEmail(
          user.email,
          "Confirmation compte FileHub",
          `Voici votre code de confirmation du compte : ${token.token}, 
          finalisez la création de votre compte en suivant  
          <a href="${process.env.FRONT_ADRESS}/verify-account/${token.token}">cette URL</a>`,
        );
        return token.token;
      } else {
        throw new Error("User not found");
      }
    } catch (e: any) {
      console.log(e);
      if (e.message === "User not found") {
        throw new Error("User not found");
      } else {
        throw new Error("An error occured when sending the verification code");
      }
    }
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
    const existingUser = await User.findOneBy({ email: data.email });
    if (existingUser) {
      throw new Error(`User already exist`);
    }

    const errors = await validate(data);
    if (errors.length !== 0) {
      throw new Error(`Password must be at least 8 characters long`);
    }

    // Créer un client Stripe
    let stripeCustomerId = 'test_stripe_customer_id';
    if (process.env.NODE_ENV !== 'test') {
    const stripeCustomer = await stripe.customers.create({
      email: data.email,
    });
    stripeCustomerId = stripeCustomer.id;
    }

    const newUser = new User();
    const hashedPassword = await argon2.hash(data.password);
    Object.assign(newUser, {
      email: data.email,
      password: hashedPassword,
      verified: false,
      stripeCustomerId: stripeCustomerId,
    });

    try {
      await newUser.save();
      await this.sendVerifCode(newUser.email);
    } catch (e) {
      console.log(e);
      throw new Error(
        `Une erreur est survenue lors de la creation de l'utilisation / l'envoi du mail de confirmation`,
      );
    }
    return newUser;
  }

  @Mutation(() => User)
  async verifyAccount(@Arg("token") token: string): Promise<User | null> {
    const userToken = await UserToken.findOne({
      where: { token: token },
      relations: { user: true },
    });

    if (userToken?.user.verified === true) {
      throw new Error(`User already verified`);
    }
    if (!userToken) {
      throw new Error(`Invalid token`);
    }
    if (userToken.expiresAt < new Date()) {
      throw new Error(`Expired token`);
    }

    userToken.user.verified = true;

    userToken.expiresAt = new Date();
    await userToken.save();
    await userToken.user.save();
    return userToken.user;
  }

  @Mutation(() => User, { nullable: true })
  async signin(
    @Ctx() context: { req: any; res: any },
    @Arg("email") email: string,
    @Arg("password") password: string,
  ): Promise<User | null> {
    const existingUser = await User.findOneBy({ email }); // Recherche de l'utilisateur existant par email
    if (!existingUser) {
      return null;
    } else {
      if (existingUser.verified !== true) {
        // Vérifier si l'email de l'utilisateur a été vérifié
        throw new Error(
          "Your email needs to be verified to connect, check your mailbox!",
        );
      } else {
        if (await argon2.verify(existingUser.password, password)) {
          // Vérifier si le mot de passe fourni correspond au mot de passe haché stocké
          const token = jwt.sign(
            // Générer un JSON Web Token (JWT) avec une expiration de 20 heures
            {
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 20,
              userId: existingUser.id,
            },
            process.env.JWT_SECRET || "supersecret",
          );
          const cookies = new Cookies(context.req, context.res); // Configurer et stocker le cookie avec le token
          cookies.set("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24, // Expire après 24 heures
          });
          return existingUser; // Retourner l'utilisateur existant
        } else {
          return null;
        }
      }
    }
  }

  // mutation called when the connected user wants to change his password, based on cookie authentification
  @Authorized()
  @Mutation(() => User)
  async updatePasswordWhenConnected(
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

  // mutation called when user is not connected and want to get an email with a token to change his password
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean | null> {
    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      console.log("nada");
      return true;
    }

    const token = new UserToken();
    token.user = user;
    token.createdAt = new Date();
    token.expiresAt = new Date(Number(token.createdAt) + 1000 * 60 * 60);
    token.token = uuid();
    await token.save();

    this.sendEmail(
      email,
      "Réinitialisation de mot de passe",
      `Voici votre code de reset : ${token.token}, 
      réinitialisez votre mot de passe via 
      <a href="${process.env.FRONT_ADRESS}/reset-password/${token.token}">cette URL</a>`,
    );
    return true;
  }

  // mutation used when the user click on the email url to change his password
  @Mutation(() => User)
  async updatePasswordWhenNotConnected(
    @Arg("token") token: string,
    @Arg("password") password: string,
  ): Promise<User | null> {
    if (password.length < 8 || password.length > 50) {
      throw new Error(`Password length must be 8 to 50 caracters`);
    }
    const userToken = await UserToken.findOne({
      where: { token: token },
      relations: { user: true },
    });

    if (!userToken) {
      throw new Error(`Invalid token`);
    }
    if (userToken.expiresAt < new Date()) {
      throw new Error(`Expired token`);
    }

    userToken.user.password = await argon2.hash(password);

    userToken.expiresAt = new Date();
    await userToken.save();
    await userToken.user.save();
    return userToken.user;
  }
}
