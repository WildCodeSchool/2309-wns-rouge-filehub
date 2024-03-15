import { afterAll, beforeAll, describe } from "@jest/globals";
import { DataSource } from "typeorm";
import { TestArgs } from "./common";
import runUsers from "./users";
import { getSchema } from "../schema";
import { dataSourceOptions } from "../datasource";

const args: TestArgs = {
  schema: null,
  dataSource: null,
  data: null,
} as unknown as TestArgs;

describe("Testing resolvers", () => {
  beforeAll(async () => {
    args.schema = await getSchema();
    args.dataSource = new DataSource({
      ...dataSourceOptions,
      dropSchema: true, // Permet de vider la db avant chaque test
      logging: false, // Permet de désactiver les logs de typeORM
    });
    await args.dataSource.initialize();
    args.data = {};
  });

  afterAll(() => {
    args.dataSource.destroy();
  });

  runUsers(args);
});
