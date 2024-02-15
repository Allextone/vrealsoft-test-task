import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { entities } from './src/infrastructure/db/postgres/entites';
import { migrations } from './migrations';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(<string>process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities,
  migrations,
});
