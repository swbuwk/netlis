import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string
    @IsEmail()
    readonly email: string
    @IsString()
    @Length(8, 32)
    readonly password: string
    @IsString()
    readonly bio: string
    @IsString()
    readonly address: string
}