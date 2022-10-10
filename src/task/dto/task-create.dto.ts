import { IsNotEmpty, IsString } from "class-validator";

export class TaskCreateDTO {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    description: string
}