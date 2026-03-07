import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from './auth.controller';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async getPayload(token: string): Promise<JwtPayload> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  async signPayload(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
