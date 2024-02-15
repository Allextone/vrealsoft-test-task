import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Users } from '../users/users.entity';

@Entity('notes')
export class Notes {
  @ApiProperty({
    example: '74b5614b-43fb-4ef4-afc4-a4209197e9dc',
    description: 'Id of note',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Shopping list', description: 'Title of note' })
  @Column({ nullable: false })
  title: string;

  @ApiProperty({
    example: '1. Milk; 2. Bread; 3.Sugar;',
    description: 'Discription of note',
  })
  @Column({ nullable: false, length: 200 })
  description: string;

  @ManyToOne(() => Users)
  @JoinColumn({ referencedColumnName: 'id', name: 'user_id' })
  user: Users;

  @ApiProperty({
    example: 'fb254615-9894-44b4-bb33-354ec2010aa5',
    description: 'User id (owner of notes)',
  })
  @Column({ nullable: false })
  user_id: string;

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
