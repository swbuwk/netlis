import { IsInt, IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator"

export class CreateTrackDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string
    @IsString()
    @MaxLength(300)
    readonly text: string
    @IsString()
    @IsUUID(4)
    @IsNotEmpty()
    readonly originalAlbumId: string
    @IsNotEmpty()
    readonly duration: string
}