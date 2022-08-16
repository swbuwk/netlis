import { IsString, IsNotEmpty } from "class-validator"

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string
    @IsString()
    readonly bio: string
    @IsString()
    readonly address: string
}