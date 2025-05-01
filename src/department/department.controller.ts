import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Department } from './entities/department.entity';
import { SubDepartment } from './entities/sub-department.entity';
import { UpdateSubDepartmentDto } from './dto/update-sub-department.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateSubDepartmentDto } from './dto/create-sub-department.dto';

@UseGuards(JwtAuthGuard)
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  // Sub-departments routes
  @Get(':departmentId/sub-departments/:subDepartmentId')
  async getSubDepartment(
    @Param('departmentId') departmentId: string,
    @Param('subDepartmentId') subDepartmentId: string,
  ): Promise<SubDepartment> {
    return await this.departmentService.findSubDepartmentById(
      +departmentId,
      +subDepartmentId,
    );
  }

  @Get(':departmentId/sub-departments')
  async findAllSubDepartments(
    @Param('departmentId') departmentId: string,
  ): Promise<SubDepartment[]> {
    return this.departmentService.findSubDepartmentsByDepartment(+departmentId);
  }

  // @Get('sub-departments/:id')
  // async getSubDepartmentById(@Param('id') id: string): Promise<SubDepartment> {
  //   const subDepartment = await this.departmentService.findSubDepartmentById(
  //     Number(id),
  //   );
  //   if (!subDepartment) {
  //     throw new HttpException('Sub-department not found', HttpStatus.NOT_FOUND);
  //   }
  //   return subDepartment;
  // }

  @Get(':departmentId/sub-departments/:subDepartmentId')
  findSubDepartmentById(
    @Param('departmentId') departmentId: string,
    @Param('subDepartmentId') subDepartmentId: string,
  ) {
    return this.departmentService.findSubDepartmentById(
      +departmentId,
      +subDepartmentId,
    );
  }

  @Post(':departmentId/sub-departments')
  @HttpCode(HttpStatus.CREATED)
  async createSubDepartment(
    @Param('departmentId') departmentId: string,
    @Body() createDto: CreateSubDepartmentDto,
  ): Promise<SubDepartment> {
    return await this.departmentService.createSubDepartment(
      +departmentId,
      createDto,
    );
  }

  @Put(':departmentId/sub-departments/:subDepartmentId')
  async updateSubDepartment(
    @Param('departmentId') departmentId: string,
    @Param('subDepartmentId') subDepartmentId: string,
    @Body() updateDto: UpdateSubDepartmentDto,
  ): Promise<SubDepartment> {
    return await this.departmentService.updateSubDepartment(
      +departmentId,
      +subDepartmentId,
      updateDto,
    );
  }

  @Delete(':departmentId/sub-departments/:subDepartmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSubDepartment(
    @Param('departmentId') departmentId: string,
    @Param('subDepartmentId') subDepartmentId: string,
  ): Promise<void> {
    await this.departmentService.deleteSubDepartment(
      +departmentId,
      +subDepartmentId,
    );
  }

  @Get()
  async getAllDepartments(): Promise<Department[]> {
    try {
      return await this.departmentService.findAllDepartments();
    } catch {
      throw new HttpException(
        'Failed to retrieve departments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    return this.departmentService.createDepartment(createDepartmentDto);
  }

  @Get(':id')
  async getDepartmentById(@Param('id') id: string): Promise<Department> {
    const department = await this.departmentService.findDepartmentById(
      Number(id),
    );
    if (!department) {
      throw new HttpException('Department not found', HttpStatus.NOT_FOUND);
    }
    return department;
  }

  @Put(':id')
  async updateDepartment(
    @Param('id') id: string,
    @Body() department: Department,
  ): Promise<Department> {
    const updated = await this.departmentService.updateDepartment(
      Number(id),
      department,
    );
    if (!updated) {
      throw new HttpException('Department not found', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @Delete(':id')
  async deleteDepartment(@Param('id') id: string): Promise<void> {
    try {
      return await this.departmentService.deleteDepartment(Number(id));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.getResponse(), HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to delete department',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
