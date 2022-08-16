import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Roles } from './roles.decorator';
import { RolesGuard } from '../auth/access.guard';
import { RolesService } from './roles.service';

@Roles("ADMIN")
@UseGuards(RolesGuard)
@Controller('roles')
export class RolesController {

    constructor(private rolesService: RolesService) {}

    @Post()
    createRole(@Body() dto: CreateRoleDto) {
        return this.rolesService.createRole(dto)
    }

    @Get()
    getAllRoles() {
        return this.rolesService.getAllRoles()
    }

    @Get("/:name")
    getRoleByName(@Param("name") name) {
        return this.rolesService.getRoleByName(name)
    }

    @Delete(":id")
    deleteRole(@Param("id") id) {
        return this.rolesService.deleteRole(id)
    }
}
