import { buildSchema } from 'type-graphql';
import { UsersResolver } from './resolvers/Users';
import { customAuthChecker } from './auth';
import { FilesResolver } from './resolvers/Files';

export async function getSchema() {
  const schema = await buildSchema({
    resolvers: [UsersResolver, FilesResolver],
    authChecker: customAuthChecker,
  });
  return schema;
}
