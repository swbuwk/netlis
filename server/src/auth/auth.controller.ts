import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post("/login")
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto)
    }

    @Post("/registration")
    registration(@Body() dto: CreateUserDto) {
        return this.authService.registration(dto)
    }

    @Post("/refresh")
    refresh(@Body("token") token: string) {
        return this.authService.refresh(token)
    }

}
