import { beforeAll, describe, expect, it } from '@jest/globals';
import { GraphQLSchema, graphql, print } from 'graphql';
import { DataSource } from 'typeorm';
import { getSchema } from '../schema';
import { dataSourceOptions } from '../datasource';
import { queryGetAllFiles } from './graphql/queryGetAllFiles';
import { serialize, parse } from 'cookie';

function mockContext(token?: string) {
  const value: { context: any; token?: string } = {
    token,
    context: {
      req: {
        headers: {
          cookie: token ? serialize('token', token) : undefined,
        },
        connection: { encrypted: false },
      },
      res: {
        getHeader: () => '',
        setHeader: (key: string, cookieValue: string | string[]) => {
          if (key === 'Set-Cookie') {
            const parsedValue = parse(
              Array.isArray(cookieValue) ? cookieValue[0] : cookieValue
            );
            if (parsedValue.token) {
              value.token = parsedValue.token;
            }
          }
        },
        headers: {},
      },
    },
  };
  console.log(token);
  return value;
}

let schema: GraphQLSchema;
let dataSource: DataSource;
let token: string | undefined;

beforeAll(async () => {
  schema = await getSchema();

  dataSource = new DataSource({
    ...dataSourceOptions,
    host: '127.0.0.1',
    port: 5433,
    username: 'test',
    password: 'test',
    database: 'filehub',
    dropSchema: false,
    logging: false,
  });

  await dataSource.initialize();
});

// pousser bcp plus le test avec plusieurs test avec creation d'un user avec inscription, connexion, puis creer fichier 1, creer fichier 2 puis faire le getAllFiles

describe('get all files resolver', () => {
  it('get all files from db', async () => {
    const mock = mockContext(token);
    const result = (await graphql({
      schema,
      source: print(queryGetAllFiles),
      contextValue: mock.context,
    })) as any;
    expect(result?.data?.allFiles).toEqual([
      {
        id: '2',
        originalName: 'test-image.png',
      },
      {
        id: '1',
        originalName: 'test-image.png',
      },
    ]);
  });
});
