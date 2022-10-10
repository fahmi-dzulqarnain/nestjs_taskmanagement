import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/model/user.entity';
import { TaskCreateDTO } from './dto/task-create.dto';
import { TaskFilter } from './dto/task-filter.dto';
import { TaskStatusUpdateDTO } from './dto/task-status-update.dto';
import { TaskService } from './task.service';

@Controller('task')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
    constructor(private service: TaskService) {}

    @Get()
    getTasks(
        @Query() filterDTO: TaskFilter,
        @GetUser() user: User
    ) {
        if(Object.keys(filterDTO).length) {
            return this.service.getTasksWithFilter(filterDTO, user)
        } else {
            return this.service.getAll(user)
        }
    }

    @Post()
    createTask(
        @Body() dto: TaskCreateDTO,
        @GetUser() user: User
    ) {
        return this.service.createTask(dto, user)
    }

    @Get(':id')
    getByID(
        @Param('id') id: string,
        @GetUser() user: User
    ) {
        return this.service.getByID(id, user)
    }

    @Delete(':id')
    deleteTask(
        @Param('id') id: string,
        @GetUser() user: User
    ) {
        return this.service.deleteTask(id, user)
    }

    @Put(':id')
    updateTask(
        @Param('id') id: string, 
        @Body() dto: Partial<TaskCreateDTO>,
        @GetUser() user: User
    ) {
        return this.service.updateTask(id, dto, user)
    }
}
