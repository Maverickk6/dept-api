import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { DepartmentService } from './department.service';
import { Department } from './entities/department.entity';
import { SubDepartment } from './entities/sub-department.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { CreateSubDepartmentDto } from './dto/create-sub-department.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateSubDepartmentDto } from './dto/update-sub-department.dto';

@UseGuards(JwtAuthGuard)
@Resolver(() => Department)
export class DepartmentResolver {
  constructor(private readonly departmentService: DepartmentService) { }

  @Query(() => [Department], { name: 'departments' })
  async getDepartments() {
    return this.departmentService.findAllDepartments();
  }

  @Mutation(() => Department)
  async createDepartment(
    @Args('createDepartmentDto') createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    return this.departmentService.createDepartment(createDepartmentDto);
  }

  @Query(() => Department, { name: 'department' })
  async getDepartmentById(@Args('id') id: string) {
    return await this.departmentService.findDepartmentById(Number(id));
  }

  @Mutation(() => Boolean)
  async deleteDepartment(@Args('id') id: string): Promise<boolean> {
    await this.departmentService.deleteDepartment(Number(id));
    return true;
  }

  @ResolveField(() => [SubDepartment])
  subDepartments(@Parent() department: Department) {
    return department.subDepartments || [];
  }

  @Mutation(() => SubDepartment)
  createSubDepartment(
    @Args('departmentId', { type: () => Int }) departmentId: number,
    @Args('input') createDto: CreateSubDepartmentDto,
  ): Promise<SubDepartment> {
    return this.departmentService.createSubDepartment(departmentId, createDto);
  }

  @Query(() => SubDepartment, { name: 'subDepartment', nullable: true })
  getSubDepartment(
    @Args('departmentId', { type: () => Int }) departmentId: number,
    @Args('subDepartmentId', { type: () => Int }) subDepartmentId: number,
  ): Promise<SubDepartment> {
    return this.departmentService.findSubDepartmentById(
      departmentId,
      subDepartmentId,
    );
  }

  @Mutation(() => SubDepartment)
  updateSubDepartment(
    @Args('departmentId', { type: () => Int }) departmentId: number,
    @Args('subDepartmentId', { type: () => Int }) subDepartmentId: number,
    @Args('input') updateDto: UpdateSubDepartmentDto,
  ): Promise<SubDepartment> {
    return this.departmentService.updateSubDepartment(
      departmentId,
      subDepartmentId,
      updateDto,
    );
  }

  @Mutation(() => Boolean)
  async deleteSubDepartment(
    @Args('departmentId', { type: () => Int }) departmentId: number,
    @Args('subDepartmentId', { type: () => Int }) subDepartmentId: number,
  ): Promise<boolean> {
    await this.departmentService.deleteSubDepartment(
      departmentId,
      subDepartmentId,
    );
    return true;
  }

  @Query(() => [SubDepartment], { name: 'subDepartments' })
  findSubDepartmentsByDepartment(
    @Args('departmentId', { type: () => Int }) departmentId: number,
  ) {
    return this.departmentService.findSubDepartmentsByDepartment(departmentId);
  }

  @Mutation(() => Department)
  updateDepartment(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateDto: UpdateDepartmentDto,
  ): Promise<Department> {
    return this.departmentService.updateDepartment(id, updateDto);
  }
}
