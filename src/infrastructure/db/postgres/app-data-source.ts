import { DataSource } from 'typeorm';
import { entities } from './entites';
// import { migrations } from 'migrations/migrations-list';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(<string>process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities,
  // migrations,
  logging: true,
});

AppDataSource.initialize();
