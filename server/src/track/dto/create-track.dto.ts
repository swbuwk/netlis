import { IsNotEmpty, IsString, IsUUID } from "class-validator"

export class CreateTrackDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string
    @IsString()
    readonly text: string
    @IsString()
    @IsUUID(4)
    @IsNotEmpty()
    readonly originalAlbumId: string
}