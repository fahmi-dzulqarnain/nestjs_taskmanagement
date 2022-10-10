import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialDTO } from './dto/auth-credential.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signUp')
    signUp(@Body() dto: AuthCredentialDTO) {
        return this.authService.createUser(dto)
    }

    @Post('signIn')
    signIn(@Body() dto: AuthCredentialDTO) {
        return this.authService.signIn(dto)
    }
}
