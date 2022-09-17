import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post("/login")
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto)
    }

    @Post("/registration")
    registration(@Body() dto: CreateUserDto) {
        return this.authService.registration(dto)
    }

    @Post("/refresh")
    refresh(@Body() {refreshToken}) {
        return this.authService.refresh(refreshToken)
    }

}
