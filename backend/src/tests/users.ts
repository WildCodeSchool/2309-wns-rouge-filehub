import { describe, expect, it } from "@jest/globals";
import { graphql, print } from "graphql";
import { TestArgs, mockContext } from "./common";
import { mutationSignup } from "./graphql/mutationSignUp";
import { User } from "../entities/User";
import { mutationSignin } from "./graphql/mutationSignIn";
import { queryMe } from "./graphql/queryMe";
import { mutationSendVerifCode } from "./graphql/mutationSendVerifCode";
import { mutationVerifAccount } from "./graphql/mutationVerifAccount";

export default function (args: TestArgs) {
  let token = "";
  describe("users resolvers", () => {
    it("creates a new user", async () => {
      const result = (await graphql({
        schema: args.schema,
        source: print(mutationSignup),
        variableValues: {
          data: {
            email: "test1@gmail.com",
            password: "supersecret",
          },
        },
      })) as any;
      expect(result.data.signup.id).toBe("1");
      // Vérifie si la mutation a retourné un ID utilisateur attendu
      const user = await User.findOneBy({ id: result.data.signup.id });
      // Récupère l'utilisateur nouvellement créé dans la base de données
      expect(!!user).toBe(true);
      // Vérifie si l'utilisateur récupéré existe
      expect(user?.password !== "supersecret").toBe(true);
      // Vérifie si le mot de passe de l'utilisateur est bien hashé dans la db
    });
    it("send a new verif token again", async () => {
      const result = (await graphql({
        schema: args.schema,
        source: print(mutationSendVerifCode),
        variableValues: {
          email: "test1@gmail.com",
        },
      })) as any;
      expect(typeof(result.data.sendVerifCode)).toBe("String");
      // Vérifie que le token a bien été généré
      token = result.data.sendVerifCode;
    });
    it("verify the account with the token", async () => {
      const result = (await graphql({
        schema: args.schema,
        source: print(mutationVerifAccount),
        variableValues: {
          token: token,
        },
      })) as any;
      expect(!!result.data.verifyAccount.id).toBe(true);
      // Vérifie que la réponse renvoi bien un objet avec un id (user)
    });
    it("cannot creates the same user", async () => {
      const result = (await graphql({
        schema: args.schema,
        source: print(mutationSignup),
        variableValues: {
          data: {
            email: "test1@gmail.com",
            password: "supersecret",
          },
        },
      })) as any;
      expect(!!result.errors).toBe(true);
      // Vérifie si des erreurs ont été renvoyées, ce qui indiquerait que la création de l'utilisateur a échoué
    });
    it("sign in with the user", async () => {
      const mock = mockContext();
      // Crée un contexte simulé avec un token
      const result = (await graphql({
        schema: args.schema,
        source: print(mutationSignin),
        variableValues: {
          email: "test1@gmail.com",
          password: "supersecret",
        },
        contextValue: mock.context,
        // Utilise le contexte simulé avec le token
      })) as any;
      expect(result.data.signin.id).toBe("1");
      // Vérifie si l'ID de l'utilisateur connecté correspond à celui attendu
      expect(!!mock.token).toBe(true);
      // Vérifie si un token a été généré pour la session de connexion
      args.data.token = mock.token;
      args.data.userId = result.data.signin.id;
      // Met à jour les données des arguments avec le token et l'ID de l'utilisateur connecté
    });
    it("returns null if not connected", async () => {
      const mock = mockContext();
      const result = (await graphql({
        schema: args.schema,
        source: print(queryMe),
        contextValue: mock.context,
      })) as any;
      expect(result.data.me).toBeNull();
      // Vérifie si les données renvoyées sont null
    });
    it("returns the profile if connected", async () => {
      const mock = mockContext(args.data.token);
      // Crée un contexte simulé avec un token (utilisateur connecté mis à jour plus haut)
      const result = (await graphql({
        schema: args.schema,
        source: print(queryMe),
        contextValue: mock.context,
      })) as any;
      expect(result.data.me.id).toBeTruthy();
      expect(result.data.me.email).toBeTruthy();
      // Vérifie si l'ID et l'e-mail de l'utilisateur sont présents dans les données renvoyées
    });
  });
}
