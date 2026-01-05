import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const user = await this.usersService.create(registerDto);

        const payload = { email: user.email, sub: user.id };
        const accessToken = this.jwtService.sign(payload);

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            accessToken,
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { email: user.email, sub: user.id };
        const accessToken = this.jwtService.sign(payload);

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            accessToken,
        };
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return null;
        }

        return user;
    }
}
