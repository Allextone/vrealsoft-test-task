import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { entities } from './src/infrastructure/db/postgres/entites';
import { migrations } from './migrations';
import { MyCustomLogger } from './src/infrastructure/logger/typeorm-logger.service';

config();

const configService: ConfigService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: parseInt(<string>configService.get('POSTGRES_PORT')),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities,
  migrations,
  synchronize: true,
  logNotifications: true,
  logging: 'all',
  logger: new MyCustomLogger(),
});
