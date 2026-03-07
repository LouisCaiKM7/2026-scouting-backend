import {
  Body,
  Controller,
  ConflictException,
  Post,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Role } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    const payload: JwtPayload = {
      sub: user.email,
      name: user.name,
      roles: user.roles,
    };
    return {
      accessToken: await this.authService.signPayload(payload),
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    if (await this.userService.isUserExistByEmail(registerDto.email)) {
      throw new ConflictException('Email already registered');
    }
    const hashedPassword = await this.authService.hashPassword(
      registerDto.password,
    );
    const user = await this.userService.createUser(
      registerDto.name,
      registerDto.email,
      hashedPassword,
      [Role.USER],
    );
    const payload: JwtPayload = {
      sub: user.email,
      name: user.name,
      roles: user.roles,
    };
    return {
      accessToken: await this.authService.signPayload(payload),
    };
  }
}

export type JwtPayload = {
  name: string;
  sub: string;
  roles: Role[];
};
