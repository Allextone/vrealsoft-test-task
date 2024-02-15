import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginRequestBody } from './request-bodies/login.request-body';
import { LoginResponseBody } from './response-bodies/login.response-body';
import { MessageType } from '../infrastructure/response-bodies/message-type.response-body';
import { JwtAuthGuard } from '../infrastructure/guards/jwt-auth.guard';
import { RequestInterface } from '../infrastructure/interfaces/request.interface';
import { CreateUserRequestBody } from '../users/request-bodies/create-user.request-body';

@Controller('api')
@ApiTags('Authorization')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: LoginResponseBody })
  @Post('auth/login/')
  login(@Req() req: RequestInterface, @Body() loginData: LoginRequestBody) {
    return this.authService.login(loginData, req.traceId);
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 200, type: LoginResponseBody })
  @Post('auth/registration/')
  registration(
    @Req() req: RequestInterface,
    @Body() body: CreateUserRequestBody,
  ) {
    return this.authService.registration(body, req.traceId);
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, type: MessageType })
  @Post('auth/logout/')
  @UseGuards(JwtAuthGuard)
  logout(
    @Req() req: RequestInterface,
    @Headers('authorization') authorization: string,
  ) {
    return this.authService.logout(authorization, req.traceId);
  }
}
