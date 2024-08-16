import {
  Body,
  Controller,
  Headers,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../infrastructure/guards/jwt-auth.guard';

import { LoginResponseBody } from './response-bodies/login.response-body';
import { CreateUserRequestBody } from '../users/request-bodies/create-user.request-body';
import { LoginRequestBody } from './request-bodies/login.request-body';

@Controller('api')
@ApiTags('Authorization')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,

    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: Number })
  @Post('auth/login/')
  async login(
    @Body() body: LoginRequestBody,
    @Res({ passthrough: true }) res: Response,
  ) {
    const loginData: LoginResponseBody = await this.authService.login(body);
    const domain: string =
      this.configService.get<string>('DOMAIN') || 'localhost';

    res.cookie('jwt', loginData.token, {
      httpOnly: true,
      domain,
      maxAge: 3600000,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      // sameSite: 'strict',
      path: '/',
    });

    return HttpStatus.OK;
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 200, type: Number })
  @Post('auth/registration/')
  async registration(
    @Body() body: CreateUserRequestBody,
    @Res({ passthrough: true }) res: Response,
  ) {
    const loginData: LoginResponseBody = await this.authService.registration(
      body,
    );
    const domain: string =
      this.configService.get<string>('DOMAIN') || 'localhost';

    res.cookie('jwt', loginData.token, {
      httpOnly: true,
      domain,
      maxAge: 3600000,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      // sameSite: 'strict',
      path: '/',
    });

    return { id: loginData.id, role: loginData.role };
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, type: Number })
  @Post('auth/logout/')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Headers('authorization') authorization: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(authorization);

    res.clearCookie('jwt');

    return HttpStatus.OK;
  }
}
