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
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Department } from './entities/department.entity';
import { SubDepartment } from './entities/sub-department.entity';

@UseGuards(JwtAuthGuard)
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  // Sub-departments routes
  @Get('sub-departments')
  async getAllSubDepartments(): Promise<SubDepartment[]> {
    try {
      return await this.departmentService.findAllSubDepartments();
    } catch {
      throw new HttpException(
        'Failed to retrieve sub-departments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('sub-departments/:id')
  async getSubDepartmentById(@Param('id') id: string): Promise<SubDepartment> {
    const subDepartment =
      await this.departmentService.findSubDepartmentById(id);
    if (!subDepartment) {
      throw new HttpException('Sub-department not found', HttpStatus.NOT_FOUND);
    }
    return subDepartment;
  }

  @Post('sub-departments')
  async createSubDepartment(
    @Body() subDepartment: SubDepartment,
  ): Promise<SubDepartment> {
    try {
      return await this.departmentService.createSubDepartment(subDepartment);
    } catch {
      throw new HttpException(
        'Failed to create sub-department',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('sub-departments/:id')
  async updateSubDepartment(
    @Param('id') id: string,
    @Body() subDepartment: SubDepartment,
  ): Promise<SubDepartment> {
    const updated = await this.departmentService.updateSubDepartment(
      id,
      subDepartment,
    );
    if (!updated) {
      throw new HttpException('Sub-department not found', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @Delete('sub-departments/:id')
  async deleteSubDepartment(@Param('id') id: string): Promise<SubDepartment> {
    try {
      return await this.departmentService.deleteSubDepartment(id);
    } catch {
      throw new HttpException(
        'Failed to delete sub-department',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Department routes
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
  async createDepartment(@Body() department: Department): Promise<Department> {
    try {
      return await this.departmentService.createDepartment(
        department.name,
        department.subDepartments,
      );
    } catch {
      throw new HttpException(
        'Failed to create department',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getDepartmentById(@Param('id') id: string): Promise<Department> {
    const department = await this.departmentService.findDepartmentById(id);
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
      id,
      department,
    );
    if (!updated) {
      throw new HttpException('Department not found', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @Delete(':id')
  async deleteDepartment(@Param('id') id: string): Promise<Department> {
    try {
      return await this.departmentService.deleteDepartment(id);
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
