import { beforeAll, describe, expect, it } from '@jest/globals';
import { GraphQLSchema, graphql, print } from 'graphql';
import { DataSource } from 'typeorm';
import { getSchema } from '../schema';
import { dataSourceOptions } from '../datasource';
import { queryGetAllFiles } from './graphql/queryGetAllFiles';

let schema: GraphQLSchema;
let dataSource: DataSource;

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

describe('get all files resolver', () => {
  it('get all files from db', async () => {
    const result = (await graphql({
      schema,
      source: print(queryGetAllFiles),
    })) as any;
    expect(result?.data?.allFiles).toEqual([
      {
        id: '1',
        originalName: 'test-image.png',
      },
      {
        id: '2',
        originalName: 'test-image.png',
      },
    ]);
  });
});
