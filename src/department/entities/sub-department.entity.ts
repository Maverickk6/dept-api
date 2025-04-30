import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Department } from './department.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@ObjectType()
@Entity()
export class SubDepartment {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  @MinLength(2, {
    message: 'Sub-department name must be at least 2 characters long.',
  })
  name: string;

  @Field(() => Department)
  @ManyToOne(() => Department, (department) => department.subDepartments)
  department: Department;
}
