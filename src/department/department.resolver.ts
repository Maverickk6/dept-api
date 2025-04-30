import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DepartmentService } from './department.service';
import { Department } from './entities/department.entity';
import { SubDepartment } from './entities/sub-department.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@UseGuards(JwtAuthGuard)
@Resolver(() => Department)
export class DepartmentResolver {
  constructor(private readonly departmentService: DepartmentService) {}

  @Query(() => [Department])
  async getDepartments() {
    return this.departmentService.findAllDepartments();
  }

  @Mutation(() => Department)
  async createDepartment(
    @Args('name') name: string,
    @Args({ name: 'subDepartments', type: () => [String], nullable: true })
    subDepartments?: { name: string }[],
  ) {
    return this.departmentService.createDepartment(name, subDepartments);
  }

  @Query(() => Department, { nullable: true })
  async getDepartmentById(@Args('id') id: string) {
    return await this.departmentService.findDepartmentById(id);
  }

  @Query(() => [SubDepartment], { nullable: true })
  async getAllSubDepartments(): Promise<SubDepartment[]> {
    return this.departmentService.findAllSubDepartments();
  }

  @Query(() => SubDepartment, { nullable: true })
  async getSubDepartmentById(@Args('id') id: string) {
    return this.departmentService.findSubDepartmentById(id);
  }

  @Mutation(() => Department)
  async updateDepartment(
    @Args('id') id: string,
    @Args('department', { type: () => UpdateDepartmentDto })
    department: UpdateDepartmentDto,
  ) {
    const updatedSubDepartments = department.subDepartments?.map((sub) => {
      const subDepartment = new SubDepartment();
      subDepartment.id = sub.id ?? 0;
      subDepartment.name = sub.name ?? '';
      subDepartment.department = { id: Number(id) } as Department;
      return subDepartment;
    });

    const updatedDepartment = {
      ...department,
      subDepartments: updatedSubDepartments,
    };

    return this.departmentService.updateDepartment(id, updatedDepartment);
  }

  @Mutation(() => Department)
  async deleteDepartment(@Args('id') id: string) {
    return this.departmentService.deleteDepartment(id);
  }
}
