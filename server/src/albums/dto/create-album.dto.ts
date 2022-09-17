import { IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class CreateAlbumDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string
    @IsString()
    readonly description: string
    @IsString()
    readonly private: string
}