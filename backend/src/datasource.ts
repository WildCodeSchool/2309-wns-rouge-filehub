import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { File } from "./entities/File";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const dataSourceOptions: PostgresConnectionOptions = {
  type: "postgres",
  entities: [File, User],
  synchronize: true,
  logging: true,
  host: "db" ?? "127.0.0.1",
  port: 5432 ?? 5571,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export const dataSource = new DataSource({
  ...dataSourceOptions,
});
