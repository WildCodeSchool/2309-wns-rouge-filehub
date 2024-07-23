import { buildSchema } from "type-graphql";
import { UsersResolver } from "./resolvers/Users";
import { customAuthChecker } from "./auth";
import { FilesResolver } from "./resolvers/Files";
import { PaymentResolver } from "./resolvers/Payment";

export async function getSchema() {
  const schema = await buildSchema({
    resolvers: [UsersResolver, FilesResolver, PaymentResolver],
    authChecker: customAuthChecker,
  });
  return schema;
}
