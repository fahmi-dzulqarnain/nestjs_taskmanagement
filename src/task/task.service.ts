import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/model/user.entity';
import { Repository } from 'typeorm';
import { TaskCreateDTO } from './dto/task-create.dto';
import { TaskFilter } from './dto/task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>
    ) {}
    private tasks: Task[] = []

    getAll(user: User) {
        return this.taskRepository.findBy({ user })
    }

    async getByID(id: string, user: User) {
        const isExists = await this.taskRepository.findOne({
            where: { id, user }
        })

        if(!isExists) {
            throw new NotFoundException(`The task with id ${id} and user ${user.username} is not found.`)
        }

        return isExists
    }

    async createTask(dto: TaskCreateDTO, user: User) {
        const task = this.taskRepository.create({
            ...dto,
            status: TaskStatus.OPEN,
            user: user
        })
        
        await this.taskRepository.save(task)
        return task
    }

    async deleteTask(id: string, user: User) {
        const isExists = await this.taskRepository.findOneBy({ id, user })

        if (!isExists) {
            throw new NotFoundException(`The task with id ${id} and user ${user.username} is not found. Delete ignored`)
        }

        this.taskRepository.delete({ id })
        return {
            message: `The task with id ${id} has been deleted`
        }
    }

    async updateTask(id: string, dto: Partial<TaskCreateDTO>, user: User) {
        const isExists = await this.taskRepository.findOneBy({ id, user })

        if(!isExists) {
            throw new NotFoundException(`The task with id ${id} and user ${user.username} is not found. Update ignored`)
        }

        await this.taskRepository.update({id}, dto)

        const task = await this.getByID(id, user)
        return task
    }

    async getTasksWithFilter(filterDTO: TaskFilter, user: User) {
        const { status, search } = filterDTO
        var filtered = await this.getAll(user)

        if(status) 
            filtered = await this.taskRepository.find({
                where: {
                    status
                }
            })

        if(search) {
            const searchQuery = search.toLowerCase()
            filtered = filtered.filter(task => 
                task.title.toLowerCase().includes(searchQuery) ||
                task.description.toLowerCase().includes(searchQuery)
            )
        }

        return filtered
    }

    async getByUser(user: User) {
        const tasks = this.taskRepository.findBy({ user: user })

        return tasks
    }
}
