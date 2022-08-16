import { Body, Controller, Delete, Get, Param, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/auth/access.guard';
import { Role } from 'src/roles/roles.model';
import { RolesService } from 'src/roles/roles.service';
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
    uploadUserPhoto(@Query("user_id") userId,
            @Req() req,
            @UploadedFile() photo: Express.Multer.File) {
        return this.usersService.uploadUserPhoto(photo, userId, req.user.id)
    }

    @Roles("USER", "ADMIN")
    @UseGuards(RolesGuard)
    @Post("/update")
    @UseInterceptors(FileInterceptor("photo"))
    updateUserInfo(@Req() req,
                    @Body() dto: UpdateUserDto) {
        return this.usersService.updateUserInfo(req.user.id, dto)
    }

    @Post("/roles")
    addUserRole(
            @Query() qs) {
        return this.usersService.addUserRole(qs.user_id, qs.role)
    }

    @Delete("/roles")
    deleteUserRole(
            @Query() qs) {
        return this.usersService.deleteUserRole(qs.user_id, qs.role)
    }

    @Roles("USER", "ADMIN")
    @UseGuards(RolesGuard)
    @Get()
    getUsers(@Query() query) {
        if (query.id) {
            return this.usersService.getUserById(query.id)
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
        const {iat, exp, ...user} = req.user
      return user
    }

    @Roles("USER", "ADMIN")
    @UseGuards(RolesGuard)
    @Delete()
    deleteUser(@Query("user_id") userId,
                @Req() req) {
        return this.usersService.deleteUser(userId, req.user)
    }
}
