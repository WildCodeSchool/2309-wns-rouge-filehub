import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { File } from "./entities/File";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const dataSourceOptions: PostgresConnectionOptions = {
  type: "postgres",
  entities: [File, User],
  synchronize: true,
  logging: false,
};

export const dataSource = new DataSource({
  ...dataSourceOptions,
  host: "db",
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
