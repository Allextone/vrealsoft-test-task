import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { UserRoleEnum } from '../infrastructure/enums/user-role.enum';

export const userRoles = Object.values(UserRoleEnum);

@Entity('users')
export class Users {
  @ApiProperty({
    example: '442e8500-d67a-4f0a-a48f-30b602d4be68',
    description: 'UUID',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Steve', description: 'First name' })
  @Column({ nullable: false })
  first_name: string;

  @ApiProperty({ example: 'Jobs', description: 'Last name' })
  @Column({ nullable: true })
  last_name: string;

  @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'Qwer1234!',
    description: 'Password. Length must be from 8 to 30',
  })
  @Column({ select: false, nullable: false })
  password: string;

  @ApiProperty({ description: 'Role of user' })
  @Column({
    type: 'enum',
    enum: userRoles,
    default: UserRoleEnum.USER,
  })
  role: UserRoleEnum;

  @ApiProperty({
    example: true,
    description: 'Value that meaning is can user create notes or not',
  })
  @Column({ nullable: false, default: true })
  is_can_create_notes: boolean;

  @ApiProperty({
    example: '2023-01-10 17:34:05.929',
    description: 'Created date',
  })
  @CreateDateColumn()
  created_date: Date;

  @ApiProperty({
    example: '2023-01-10 17:34:05.929',
    description: 'Updated date',
  })
  @UpdateDateColumn()
  updated_date: Date;

  @ApiProperty({
    example: '2023-01-10 17:34:05.929',
    description: 'Deleted date',
  })
  @DeleteDateColumn()
  deleted_date: Date;
}
