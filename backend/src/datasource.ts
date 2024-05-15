import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { File } from "./entities/File";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { UserToken } from "./entities/UserToken";

export const dataSourceOptions: PostgresConnectionOptions = {
  type: "postgres",
  entities: [File, User, UserToken],
  synchronize: true,
  logging: true,
  host: process.env.DB_HOST ?? "db",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export const dataSource = new DataSource({
  ...dataSourceOptions,
});
