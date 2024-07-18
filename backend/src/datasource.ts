import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { File } from "./entities/File";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { UserToken } from "./entities/UserToken";

// Définition des options de connexion à la base de données PostgreSQL
export const dataSourceOptions: PostgresConnectionOptions = {
  type: "postgres", // Type de base de données
  entities: [File, User, UserToken], // Entités à utiliser par TypeORM
  synchronize: true, // Synchroniser la base de données avec les entités
  logging: true, // Activer les logs pour les opérations de la base de données
  host: process.env.DB_HOST ?? "db", // Hôte de la base de données
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432, // Port de la base de données
  username: process.env.DB_USERNAME, // Nom d'utilisateur pour la connexion
  password: process.env.DB_PASSWORD, // Mot de passe pour la connexion
  database: process.env.DB_NAME, // Nom de la base de données
};

// Création d'une nouvelle instance de DataSource avec les options définies
export const dataSource = new DataSource({
  ...dataSourceOptions,
});
