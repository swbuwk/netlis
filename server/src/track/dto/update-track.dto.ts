import { IsNotEmpty, IsString, IsUUID } from "class-validator"

export class UpdateTrackDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string
    @IsString()
    readonly text: string
}