import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.model';

@Injectable()
export class RolesService {
    
    constructor(@InjectModel(Role) private rolesRepository: typeof Role) {}

    async createRole(dto: CreateRoleDto) {
        const role = await this.rolesRepository.create(dto)
        return role
    }

    async getAllRoles() {
        const roles = await this.rolesRepository.findAll() 
        return roles
    }

    async getRoleByName(name) {
        const role = await this.rolesRepository.findOne({where: {name}})
        return role
    }

    async deleteRole(id) {
        const deletedRole = await this.rolesRepository.destroy({where: {id}})  
        return deletedRole
    }
}
