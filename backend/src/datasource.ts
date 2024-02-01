import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { File } from "./entities/File";

export const dataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, File],
  synchronize: true,
  logging: false,
});
