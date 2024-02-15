import { MigrationInterface, QueryRunner } from 'typeorm';
import { hashSync, genSaltSync } from 'bcryptjs';

export class Migrations1708037657129 implements MigrationInterface {
  name = 'Migrations1708037657129';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const createUserQuery = `INSERT INTO "users"
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;

    const salt: string = genSaltSync(12);
    const password: string = hashSync('ksIw1q123!', salt);

    await queryRunner.query(createUserQuery, [
      '6a53471e-43f0-4527-b123-ca29a42905e5',
      'John',
      'Walter',
      'john.walter@mailinator.com',
      password,
      'USER',
      true,
      new Date(),
      new Date(),
      null,
    ]);

    const createNoteQuery = `INSERT INTO "notes"
    VALUES ($1, $2, $3, $4, $5, $6, $7)`;

    await queryRunner.query(createNoteQuery, [
      '08de87b5-dcbb-4fcf-bbfb-be13ee49b917',
      'Shopping list',
      '1. Milk; 2. Cheese; 3. Bread;',
      '6a53471e-43f0-4527-b123-ca29a42905e5',
      new Date(),
      new Date(),
      null,
    ]);

    await queryRunner.query(createNoteQuery, [
      '0ec030bd-291b-417c-9c3a-ddbc98efa984',
      'Friends birthday',
      `Mia 27.03\n
       Rachel 12.09\n
       Steve 01.07\n
      `,
      '6a53471e-43f0-4527-b123-ca29a42905e5',
      new Date(),
      new Date(),
      null,
    ]);

    await queryRunner.query(createNoteQuery, [
      '090ee5a3-3eef-4df5-a51c-84f1ca7a462a',
      'Morning affairs',
      'First go to the gym. Then go to the store on the way home. Prepare lunch.',
      '6a53471e-43f0-4527-b123-ca29a42905e5',
      new Date(),
      new Date(),
      null,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //nothing
  }
}
