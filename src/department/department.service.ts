import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { SubDepartment } from './entities/sub-department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,

    @InjectRepository(SubDepartment)
    private readonly subDepartmentRepository: Repository<SubDepartment>,
  ) {}

  async createDepartment(
    name: string,
    subDepartments?: { name: string }[],
  ): Promise<Department> {
    const department = this.departmentRepository.create({ name });
    if (subDepartments) {
      department.subDepartments = subDepartments.map((sub) =>
        this.subDepartmentRepository.create(sub),
      );
    }
    return this.departmentRepository.save(department);
  }

  async findAllDepartments(): Promise<Department[]> {
    return this.departmentRepository.find({ relations: ['subDepartments'] });
  }

  async findDepartmentById(id: string): Promise<Department | null> {
    return this.departmentRepository.findOne({
      where: { id: Number(id) },
      relations: ['subDepartments'],
    });
  }

  async updateDepartment(
    id: string,
    department: Partial<Department>,
  ): Promise<Department> {
    const existingDepartment = await this.departmentRepository.findOne({
      where: { id: Number(id) },
      relations: ['subDepartments'],
    });

    if (!existingDepartment) {
      throw new NotFoundException('Department not found');
    }

    // Update department name if provided
    if (department.name) {
      existingDepartment.name = department.name;
    }

    // Handle sub-departments update
    if (department.subDepartments) {
      // Get IDs of sub-departments in the update request
      const updatedSubDepartmentIds = department.subDepartments
        .map((sub) => sub.id)
        .filter(Boolean);

      // Remove sub-departments that are not in the update
      await Promise.all(
        existingDepartment.subDepartments
          .filter((sub) => !updatedSubDepartmentIds.includes(sub.id))
          .map((sub) => this.subDepartmentRepository.remove(sub)),
      );

      // Update or create sub-departments
      const updatedSubDepartments = await Promise.all(
        department.subDepartments.map(async (sub) => {
          if (sub.id) {
            // Update existing sub-department
            const existingSub = await this.subDepartmentRepository.findOne({
              where: { id: sub.id },
            });
            if (existingSub) {
              Object.assign(existingSub, sub);
              return this.subDepartmentRepository.save(existingSub);
            }
          }
          
          // Create new sub-department
          const newSub = this.subDepartmentRepository.create({
            ...sub,
            department: existingDepartment,
          });
          return this.subDepartmentRepository.save(newSub);
        }),
      );

      existingDepartment.subDepartments = updatedSubDepartments;
    }

    return this.departmentRepository.save(existingDepartment);
  }

  async deleteDepartment(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id: Number(id) },
      relations: ['subDepartments'],
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    // Delete all associated sub-departments first
    if (department.subDepartments && department.subDepartments.length > 0) {
      await Promise.all(
        department.subDepartments.map((sub) =>
          this.subDepartmentRepository.remove(sub),
        ),
      );
    }

    // Now delete the department
    return this.departmentRepository.remove(department);
  }

  async findAllSubDepartments(): Promise<SubDepartment[]> {
    return await this.subDepartmentRepository.find({
      select: {
        id: true,
        name: true,
      },
      relations: {
        department: true,
      },
    });
  }

  async createSubDepartment(
    subDepartment: SubDepartment,
  ): Promise<SubDepartment> {
    return this.subDepartmentRepository.save(subDepartment);
  }

  async updateSubDepartment(
    id: string,
    subDepartment: Partial<SubDepartment>,
  ): Promise<SubDepartment | null> {
    await this.subDepartmentRepository.update(id, subDepartment);
    return this.subDepartmentRepository.findOne({ where: { id: Number(id) } });
  }

  async deleteSubDepartment(id: string): Promise<SubDepartment> {
    const subDepartment = await this.subDepartmentRepository.findOne({
      where: { id: Number(id) },
    });
    if (!subDepartment) {
      throw new Error('Sub-department not found');
    }
    return this.subDepartmentRepository.remove(subDepartment);
  }

  async findSubDepartmentById(id: string): Promise<SubDepartment | null> {
    try {
      const subDepartment = await this.subDepartmentRepository.findOne({
        where: { id: Number(id) },
        relations: {
          department: true,
        },
      });

      if (!subDepartment) {
        throw new NotFoundException('Sub-department not found');
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
}
