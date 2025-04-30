import { Field, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubDepartmentDto } from './create-sub-department.dto';

@InputType()
export class CreateDepartmentDto {
  @Field()
  @IsString()
  @MinLength(2)
  name: string;

  @Field(() => [CreateSubDepartmentDto], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubDepartmentDto)
  subDepartments?: CreateSubDepartmentDto[];
}
