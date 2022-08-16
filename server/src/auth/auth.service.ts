import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/roles/roles.model';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
                private jwtService: JwtService) {}

    async login(dto: LoginDto) {
        const user = await this.usersService.getUserByEmail(dto.email)
        if (!user) {
            throw new HttpException("Пользователя с таким email не существует", HttpStatus.BAD_REQUEST)
        }
        const isPasswordsEqual = await bcrypt.compare(dto.password, user.password)
        if (!isPasswordsEqual) {
            throw new HttpException("Неверный пароль", HttpStatus.UNAUTHORIZED)
        }
        return this.generateTokens(user)
        
    }

    async registration(dto: CreateUserDto) {
        const candidate = await this.usersService.getUserByEmail(dto.email)
        if (candidate) {
            throw new HttpException("Пользователь с таким email уже существует", HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(dto.password, 5)
        const user = await this.usersService.createUser({...dto, password: hashPassword}, null)
        return this.generateTokens(user)
    }

    async generateTokens(user: User) {
        console.log(process.env.SECRET_KEY)
        const payload = {email: user.email, id: user.id, roles: user.roles}
        return {access_token:  this.jwtService.sign(payload, {expiresIn: "30m", secret: process.env.SECRET_KEY}),
                refresh_token: this.jwtService.sign(payload, {expiresIn: "10d", secret: process.env.SECRET_KEY})}
    }

    async refresh(token: string) {
        try {
            const user = this.jwtService.verify(token)
            const candidate = this.usersService.getUserById(user.id)
            if (!candidate) throw new HttpException("Пользователя не существует", HttpStatus.BAD_REQUEST)
            return this.generateTokens(user)
        } catch (error) {
            throw new HttpException("Невалидный токен", HttpStatus.BAD_REQUEST)
        }
    }

}
