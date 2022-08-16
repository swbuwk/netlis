import { HttpException, HttpStatus, Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from 'src/files/files.service';
import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import * as uuid from "uuid"
import { Role } from 'src/roles/roles.model';
import { UserRole } from 'src/roles/user-roles.model';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                @InjectModel(UserRole) private userRolesRepository: typeof UserRole,
                private filesService: FilesService,
                private rolesService: RolesService) {}


    async createUser(dto: CreateUserDto, image) {
        const id = uuid.v4()
        let photo = null
        if (image) {
            photo = await this.filesService.uploadImage(image)
        }
        const user = await this.userRepository.create({...dto, id, photo})
        const userWithRole = await this.addUserRole(user.id, "USER")
        return userWithRole
    }

    async uploadUserPhoto(image, userId, requestedUserId) {
        if (userId !== requestedUserId) {
            throw new HttpException("Вы не можете редактировать другого пользователя", HttpStatus.BAD_REQUEST)
        }
        const photo = await this.filesService.uploadImage(image)
        const user = await this.userRepository.findByPk(userId)
        user.photo = photo
        return user
    }

    async updateUserInfo(userId, dto: UpdateUserDto) {
        const user = await this.getUserById(userId)
        user.name = dto.name
        user.address = dto.address
        user.bio = dto.bio
        await user.save()
        return user
    }

    async addUserRole(userId, roleName) {
        const user = await this.userRepository.findByPk(userId)
        const role = await this.rolesService.getRoleByName(roleName)
          
        await this.userRolesRepository.create({userId, roleId: role.id})
        return user
    }

    async deleteUserRole(userId, roleName) {
        const user = await this.userRepository.findByPk(userId)
        const role = await this.rolesService.getRoleByName(roleName)
          
        await this.userRolesRepository.destroy({where: {userId, roleId: role.id}})
        return user
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({include: {all: true}})
        return users
    }

    async getUserById(userId) {
        const user = await this.userRepository.findOne({where: {id: userId}, include: {all: true}})
        return user
    }

    async getUserByEmail(email) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}})
        return user
    }

    async deleteUser(userId, requestedUser) {
        if (userId !== requestedUser.id || !requestedUser.roles.some(role => role.name === "ADMIN")) {
            throw new HttpException("Вы не можете удалять другого пользователя", HttpStatus.BAD_REQUEST)
        }
        const deleted = await this.userRepository.destroy({where: {id: userId}})
        return {deleted}
    }
}
