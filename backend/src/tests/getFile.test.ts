import { beforeAll, describe, expect, it } from '@jest/globals';
import { GraphQLSchema, graphql, print } from 'graphql';
import { DataSource } from 'typeorm';
import { queryGetFile } from './graphql/queryGetFile';
import { getSchema } from '../schema';
import { dataSourceOptions } from '../datasource';

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

describe('get file resolver', () => {
  it('get a file by his unique name', async () => {
    const result = (await graphql({
      schema,
      source: print(queryGetFile),
      variableValues: {
        uniqueName: '1707472592637test-image.png',
      },
    })) as any;
    expect(result?.data?.getFile?.uniqueName).toBe(
      '1707472592637test-image.png'
    );
  });
});
