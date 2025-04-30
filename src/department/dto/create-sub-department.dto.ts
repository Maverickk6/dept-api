import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class CreateSubDepartmentDto {
  @Field()
  @IsString()
  @MinLength(2)
  name: string;
}