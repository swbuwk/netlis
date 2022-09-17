import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from '../files/files.service';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import * as uuid from "uuid"
import { UserRole } from '../roles/user-roles.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { AlbumsService } from 'src/albums/albums.service';
import { Album } from 'src/albums/albums.model';
import { Role } from 'src/roles/roles.model';
import { where } from 'sequelize/types';
import { Track } from 'src/track/models/track.model';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private usersRepository: typeof User,
                @InjectModel(UserRole) private userRolesRepository: typeof UserRole,
                private albumsService: AlbumsService,
                private filesService: FilesService,
                private rolesService: RolesService) {}


    async createUser(dto: CreateUserDto, image) {
        const id = uuid.v4()
        let photo = null
        if (image) {
            photo = await this.filesService.uploadImage(image)
        }
        const user = await this.usersRepository.create({...dto, id, photo})
        const album = await this.albumsService.createAlbum({
            name: "My songs",
            description: "",
            private: "true",
        }, id, null, true)
        const userWithRole = await this.addUserRole(user.id, "USER")
        userWithRole.mainAlbum = album
        await userWithRole.save()
        return userWithRole
    }

    async uploadUserPhoto(image, userId) {
        const photo = await this.filesService.uploadImage(image)
        const user = await this.usersRepository.findByPk(userId)
        user.photo = photo
        await user.save()
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
        const user = await this.usersRepository.findByPk(userId, {include: {all: true}})
        const role = await this.rolesService.getRoleByName(roleName)
          
        await this.userRolesRepository.create({userId, roleId: role.id})
        user.roles.push(role)
        await user.save()
        return user
    }

    async deleteUserRole(userId, roleName) {
        const user = await this.usersRepository.findByPk(userId)
        const role = await this.rolesService.getRoleByName(roleName)
          
        await this.userRolesRepository.destroy({where: {userId, roleId: role.id}})
        return user
    }

    async getAllUsers() {
        const users = await this.usersRepository.findAll({include: [
            {
                model: Role,
            },
            {
                model: Album,
                as: "albums"
            }
        ],
        attributes: {exclude: ['password', "email"]}
        })
        return users
    }

    async getUserById(userId) {
        const user = await this.usersRepository.findOne({where: {id: userId}, include: [
            {
                model: Role,
            },
            {
                model: Album,
                as: "albums"
            },
            {
                model: Album,
                as: "mainAlbum",
                where: {isMain: true,
                        authorId: userId},
                include: [
                    {
                        model: Track
                    }
                ]
                
            }
        ],
        attributes: {exclude: ['password']}})
        console.log(user)
        return user
    }

    async getUserByEmail(email) {
        const user = await this.usersRepository.findOne({where: {email}, include: [
            {
                model: Role,
            },
            {
                model: Album,
                as: "albums"
            },
        ]})
        return user
    }

    async deleteUser(userId, requestedUser) {
        if (userId !== requestedUser.id && !requestedUser.roles.some(role => role.name === "ADMIN")) {
            throw new HttpException("You cannot delete this user", HttpStatus.BAD_REQUEST)
        }
        const deleted = await this.usersRepository.destroy({where: {id: userId}})
        return {deleted}
    }
}
