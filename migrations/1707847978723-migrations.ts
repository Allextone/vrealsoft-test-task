import { MigrationInterface, QueryRunner } from 'typeorm';
import { hashSync, genSaltSync } from 'bcryptjs';

export class Migrations1707847978723 implements MigrationInterface {
  name = 'Migrations1707847978723';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `INSERT INTO "users"
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;

    const salt: string = genSaltSync(12);
    const password: string = hashSync('qwer1234A!', salt);

    await queryRunner.query(query, [
      'cb699cc0-d9e0-4213-aee3-d1ffcf056989',
      'admin',
      'admin',
      'cryptology.test.admin.@mailinator.com',
      password,
      'ADMIN',
      true,
      new Date(),
      new Date(),
      null,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //nothing
  }
}
