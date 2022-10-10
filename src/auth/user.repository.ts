import { DataSource, Repository } from "typeorm";
import { AuthCredentialDTO } from "./dto/auth-credential.dto";
import { User } from "./model/user.entity";
import  * as bcrypt from "bcrypt"
import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager())
    }

    async createUser(dto: AuthCredentialDTO) {
        const { username, password } = dto

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = this.create({
            username, password: hashedPassword
        })

        try {
            await this.save(user)

            return {
                message: "Account Created Successfully"
            }
        } catch (error) {
            if(error.code === '23505') {
                throw new ConflictException('Username is already exists')
            } else {
                throw new InternalServerErrorException()
            }
        }
    }
}