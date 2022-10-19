import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    @Length(0, 200)
    readonly text: string
}