import { IsEmail, IsString, Length } from "class-validator"

export class LoginDto {
    @IsEmail()
    readonly email: string
    @IsString()
    readonly password: string
}