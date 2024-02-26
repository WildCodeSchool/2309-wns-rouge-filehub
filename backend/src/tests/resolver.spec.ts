import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { DataSource } from "typeorm";
import { TestArgs } from "./common";
import runUsers from "./resolvers/users";
import { getSchema } from "../schema";
import { dataSourceOptions } from "../datasource";

// prepare common data
const args: TestArgs = {
  schema: null,
  dataSource: null,
  data: null,
} as unknown as TestArgs;

// run all needed tests
describe("Testing resolvers", () => {
  beforeAll(async () => {
    args.schema = await getSchema();
    args.dataSource = new DataSource({
      ...dataSourceOptions,
      dropSchema: true,
      logging: false,
    });
    await args.dataSource.initialize();
    args.data = {};
  });

  afterAll(() => {
    args.dataSource.destroy();
  });

  runUsers(args);
});
