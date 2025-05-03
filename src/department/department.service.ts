import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { SubDepartment } from './entities/sub-department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { UpdateSubDepartmentDto } from './dto/update-sub-department.dto';
import { CreateSubDepartmentDto } from './dto/create-sub-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,

    @InjectRepository(SubDepartment)
    private readonly subDepartmentRepository: Repository<SubDepartment>,
  ) { }

  async createDepartment(createDto: CreateDepartmentDto): Promise<Department> {
    try {
      const department = this.departmentRepository.create({
        name: createDto.name,
        // Create sub-departments as plain objects to leverage cascade
        subDepartments: createDto.subDepartments?.map((subDto) => ({
          name: subDto.name,
        })),
      });

      return await this.departmentRepository.save(department);
    } catch (error) {
      console.error('Error creating department:', error);
      throw new InternalServerErrorException('Failed to create department');
    }
  }

  async findAllDepartments(): Promise<Department[]> {
    try {
      return this.departmentRepository.find({
        relations: ['subDepartments'],
        order: { id: 'ASC' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch departments');
    }
  }

  async findDepartmentById(id: number): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['subDepartments'],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return department;
  }

  async updateDepartment(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    try {
      const existingDepartment = await this.findDepartmentById(id);

      if (updateDepartmentDto.name) {
        existingDepartment.name = updateDepartmentDto.name;
      }

      if (updateDepartmentDto.subDepartments) {
        await this.handleSubDepartmentsUpdate(
          existingDepartment,
          updateDepartmentDto.subDepartments,
        );
      }

      return await this.departmentRepository.save(existingDepartment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update department');
    }
  }

  private async handleSubDepartmentsUpdate(
    department: Department,
    subDepartmentsDto: UpdateSubDepartmentDto[],
  ): Promise<void> {
    const existingSubs = department.subDepartments || [];
    // Map the DTOs to the SubDepartment entities
    const updatedSubs = subDepartmentsDto.map((dto) => {
      if (dto.id) {
        // Update existing sub-department
        const existing = existingSubs.find((sub) => sub.id === dto.id);
        if (existing) {
          existing.name = dto.name || existing.name;
          return existing;
        }
      }
      // Create a new sub-department with no ID in the DTO
      return this.subDepartmentRepository.create({
        name: dto.name,
        department, // Set parent relationship
      });
    });
    // Remove sub-departments which were not included in the DTO
    const subsToRemove = existingSubs.filter(
      (existingSub) => !updatedSubs.some((sub) => sub.id === existingSub.id),
    );
    if (subsToRemove.length > 0) {
      await this.subDepartmentRepository.remove(subsToRemove);
    }

    // Assign updated sub-departments to the department
    department.subDepartments = updatedSubs;
  }

  async deleteDepartment(id: number): Promise<void> {
    return this.departmentRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const department = await transactionalEntityManager.findOne(
          Department,
          {
            where: { id },
            relations: ['subDepartments'],
          },
        );

        if (!department) {
          throw new NotFoundException(`Department ${id} not found`);
        }

        if (department.subDepartments?.length) {
          await transactionalEntityManager.remove(
            SubDepartment,
            department.subDepartments,
          );
        }

        await transactionalEntityManager.remove(Department, department);
      },
    );
  }

  async createSubDepartment(
    departmentId: number,
    createDto: CreateSubDepartmentDto,
  ): Promise<SubDepartment> {
    const department = await this.departmentRepository.findOneBy({
      id: departmentId,
    });
    if (!department) {
      throw new NotFoundException(`Department ${departmentId} not found`);
    }

    const subDepartment = this.subDepartmentRepository.create({
      ...createDto,
      department,
    });

    return this.subDepartmentRepository.save(subDepartment);
  }

  async updateSubDepartment(
    departmentId: number,
    subDepartmentId: number,
    updateDto: UpdateSubDepartmentDto,
  ): Promise<SubDepartment> {
    // First verify the department exists
    await this.findDepartmentById(departmentId);

    // Get the existing sub-department
    const subDepartment = await this.subDepartmentRepository.findOne({
      where: {
        id: subDepartmentId,
        department: { id: departmentId },
      },
      relations: ['department'],
    });

    if (!subDepartment) {
      throw new NotFoundException(
        `SubDepartment ${subDepartmentId} not found in Department ${departmentId}`,
      );
    }

    // Update fields if provided in DTO
    if (updateDto.name !== undefined) {
      subDepartment.name = updateDto.name;

      return this.subDepartmentRepository.save(subDepartment);
    }
  }

  async deleteSubDepartment(
    departmentId: number,
    subDepartmentId: number,
  ): Promise<void> {
    try {
      const subDepartment = await this.findSubDepartmentById(
        departmentId,
        subDepartmentId,
      );
      await this.subDepartmentRepository.remove(subDepartment);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete sub-department');
    }
  }
  async findSubDepartmentById(
    departmentId: number,
    subDepartmentId: number,
  ): Promise<SubDepartment> {
    try {
      const subDepartment = await this.subDepartmentRepository.findOne({
        where: {
          id: subDepartmentId,
          department: { id: departmentId },
        },
        relations: ['department'],
      });

      if (!subDepartment) {
        throw new NotFoundException(
          `SubDepartment with ID ${subDepartmentId} not found in Department ${departmentId}`,
        );
      }

      return subDepartment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to retrieve sub-department',
      );
    }
  }

  async findSubDepartmentsByDepartment(
    departmentId: number,
  ): Promise<SubDepartment[]> {
    try {
      await this.findDepartmentById(departmentId); // Verify department exists
      return this.subDepartmentRepository.find({
        where: { department: { id: departmentId } },
        order: { id: 'ASC' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch sub-departments');
    }
  }
}
