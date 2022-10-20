import { Body, Controller, Delete, Get, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../auth/access.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Roles("ADMIN")
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
    
    constructor(private usersService: UsersService) {}

    @Post()
    @UseInterceptors(FileInterceptor("photo"))
    createUser(@Body() dto: CreateUserDto,
            @UploadedFile() photo: Express.Multer.File) {
        return this.usersService.createUser(dto, photo)
    }

    @Roles("USER", "ADMIN")
    @UseGuards(RolesGuard)
    @Post("/photo")
    @UseInterceptors(FileInterceptor("photo"))
    uploadUserPhoto(
            @Req() req,
            @UploadedFile() photo: Express.Multer.File) {
        return this.usersService.uploadUserPhoto(photo, req.user.id)
    }

    @Roles("USER", "ADMIN")
    @UseGuards(RolesGuard)
    @Patch()
    @UseInterceptors(FileInterceptor("photo"))
    updateUserInfo(@Req() req,
                    @Body() dto: UpdateUserDto) {
        return this.usersService.updateUserInfo(req.user.id, dto)
    }

    @Post("/roles")
    addUserRole(
            @Query("user_id") userId,
            @Query("role") role) {
        return this.usersService.addUserRole(userId, role)
    }

    @Delete("/roles")
    deleteUserRole(
        @Query("user_id") userId,
        @Query("role") role) {
        return this.usersService.deleteUserRole(userId, role)
    }

    @Roles("USER", "ADMIN")
    @UseGuards(RolesGuard)
    @Get()
    getUsers(@Query() query) {
        if (query.user_id) {
            return this.usersService.getUserById(query.user_id)
        }
        if (query.email) {
            return this.usersService.getUserByEmail(query.email)
        }
        return this.usersService.getAllUsers()
    }

    @Roles("USER", "ADMIN")
    @UseGuards(RolesGuard)
    @Get("/me")
    getMe(@Req() req) {
        return this.usersService.getUserById(req.user.id)
    }

    @Roles("USER", "ADMIN")
    @UseGuards(RolesGuard)
    @Delete()
    deleteUser(@Query("user_id") userId,
                @Req() req) {
        return this.usersService.deleteUser(userId, req.user)
    }
}
