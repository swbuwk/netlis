import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    readonly text: string
}