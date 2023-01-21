import { IsEnum, IsString } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class TaskStatusUpdateDTO {
    //@IsEnum(TaskStatus)
    status: string
}