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
  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @ApiProperty({ example: 'Jobs', description: 'Last name' })
  @Column({ name: 'last_name', nullable: true })
  lastName: string;

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
    description: 'Value that meaning is can user create posts or not',
  })
  @Column({ name: 'is_can_create_posts', nullable: false, default: true })
  isCanCreatePosts: boolean;

  @ApiProperty({
    example: '2023-01-10 17:34:05.929',
    description: 'Created date',
  })
  @CreateDateColumn({ name: 'created_date' })
  createdDate: Date;

  @ApiProperty({
    example: '2023-01-10 17:34:05.929',
    description: 'Updated date',
  })
  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate: Date;

  @ApiProperty({
    example: '2023-01-10 17:34:05.929',
    description: 'Deleted date',
  })
  @DeleteDateColumn({ name: 'deleted_date' })
  deletedDate: Date;
}
