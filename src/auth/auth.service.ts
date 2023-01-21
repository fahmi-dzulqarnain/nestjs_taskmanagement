import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDTO } from './dto/auth-credential.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private repository: UserRepository,
        private jwtService: JwtService
    ) {}

    async createUser(dto: AuthCredentialDTO) {
        return await this.repository.createUser(dto)
    }

    async signIn(dto: AuthCredentialDTO) {
        const { username, password } = dto
        const user = await this.repository.findOneBy({ username })

        if(!user)
            throw new UnauthorizedException("Username can't be found")

        if(!await bcrypt.compare(password, user.password)) 
            throw new ForbiddenException("Wrong password")

        const payload = { username }
        const accessToken = await this.jwtService.signAsync(payload)

        return {
            accessToken: accessToken
        }
    }

    async signInWithoutJwt(dto: AuthCredentialDTO) {
        const { username, password } = dto
        const user = await this.repository.findOneBy({ username })

        if(!user)
            throw new UnauthorizedException("Username can't be found")

        if(!await bcrypt.compare(password, user.password))
            throw new ForbiddenException("Wrong password")
        return {
            accessToken: "Success Login"
        }
    }
}
