import Cookies from "cookies";
import jwt from "jsonwebtoken";
import { AuthChecker } from "type-graphql";
import { User } from "./entities/User";

export type ContextType = {
  req: any;
  res: any;
  user?: User;
};

// Permet d'extraire un utilisateur à partir du cookie stocké dans l'en tête de la requête http
export async function getUserFromReq(req: any, res: any): Promise<User | null> {
  const cookies = new Cookies(req, res);
  const token = cookies.get("token");

  if (!token) {
    console.error("missing token");
    return null;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "supersecret");

    if (typeof payload === "object" && "userId" in payload) {
      const user = await User.findOneBy({ id: payload.userId });

      if (user !== null) {
        return Object.assign(user, { hashedPassword: undefined });
      } else {
        console.error("User not found");
        return null;
      }
    } else {
      console.error("invalid token, msising userid");
      return null;
    }
  } catch {
    console.error("invalid token");
    return null;
  }
}

// Retourne true ou false si l'utilisateur est connecté ou non
// Ajoute l’utilisateur au contexte
export const customAuthChecker: AuthChecker<ContextType> = async ({
  context,
}) => {
  const connectedUser = await getUserFromReq(context.req, context.res);
  console.log(context, "context");

  if (connectedUser) {
    context.user = connectedUser;
    return true;
  } else {
    return false;
  }
};
