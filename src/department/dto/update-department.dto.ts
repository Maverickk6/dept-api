import { Field, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateSubDepartmentDto } from './update-sub-department.dto';

@InputType()
export class UpdateDepartmentDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @Field(() => [UpdateSubDepartmentDto], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSubDepartmentDto)
  subDepartments?: UpdateSubDepartmentDto[];
}
