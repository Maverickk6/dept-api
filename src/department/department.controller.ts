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
  InternalServerErrorException,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Department } from './entities/department.entity';
import { SubDepartment } from './entities/sub-department.entity';
import { UpdateSubDepartmentDto } from './dto/update-sub-department.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateSubDepartmentDto } from './dto/create-sub-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';


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
    try {
      return await this.departmentService.findSubDepartmentById(
        +departmentId,
        +subDepartmentId,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `Sub department not found`,
        );
      }
      throw new InternalServerErrorException('Failed to retrieve sub department');
    }
  }

  @Get(':departmentId/sub-departments')
  @HttpCode(HttpStatus.OK)
  async findAllSubDepartments(
    @Param('departmentId') departmentId: string,
  ): Promise<SubDepartment[]> {
    try {
      return await this.departmentService.findSubDepartmentsByDepartment(
        +departmentId,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `Sub department(s) from ID ${departmentId} not found`,
        );
      }
      throw new InternalServerErrorException(
        'Failed to retrieve sub-departments',
      );
    }
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
    try {
      return await this.departmentService.createSubDepartment(
        +departmentId,
        createDto,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `Department with ID ${departmentId} not found`,
        );
      }
      throw new InternalServerErrorException('Failed to create sub-department');
    }
  }

  @Put(':departmentId/sub-departments/:subDepartmentId')
  @HttpCode(HttpStatus.OK)
  async updateSubDepartment(
    @Param('departmentId') departmentId: string,
    @Param('subDepartmentId') subDepartmentId: string,
    @Body() updateDto: UpdateSubDepartmentDto,
  ): Promise<SubDepartment> {
    try {
      return await this.departmentService.updateSubDepartment(
        +departmentId,
        +subDepartmentId,
        updateDto,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `Sub-department ${subDepartmentId} not found in department ${departmentId}`,
        );
      }
      throw new InternalServerErrorException('Failed to update sub-department');
    }
  }


  @Delete(':departmentId/sub-departments/:subDepartmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSubDepartment(
    @Param('departmentId') departmentId: string,
    @Param('subDepartmentId') subDepartmentId: string,
  ): Promise<void> {
    try {
      await this.departmentService.deleteSubDepartment(
        +departmentId,
        +subDepartmentId,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `Sub-department ${subDepartmentId} not found in department ${departmentId}`,
        );
      }
      throw new InternalServerErrorException('Failed to delete sub-department');
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllDepartments(): Promise<Department[]> {
    try {
      return await this.departmentService.findAllDepartments();
    } catch {
      throw new InternalServerErrorException('Failed to retrieve departments');
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    try {
      return await this.departmentService.createDepartment(createDepartmentDto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create department');
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getDepartmentById(@Param('id') id: string): Promise<Department> {
    try {
      return await this.departmentService.findDepartmentById(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Department with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to retrieve department');
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateDepartment(
    @Param('id') id: string,
    @Body() updateDto: UpdateDepartmentDto,
  ): Promise<Department> {
    try {
      return await this.departmentService.updateDepartment(+id, updateDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Department with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to update department');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDepartment(@Param('id') id: string): Promise<void> {
    try {
      await this.departmentService.deleteDepartment(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Department with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to delete department');
    }
  }
}
