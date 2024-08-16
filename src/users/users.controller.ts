import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Req,
  Delete,
} from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Users } from './users.entity';
import { UsersService } from './users.service';

import { JwtAuthGuard } from '../infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/guards/roles.guard';
import { Roles } from '../infrastructure/decorators/roles.decorator';

import { UserRoleEnum } from '../infrastructure/enums/user-role.enum';

import { RequestInterface } from '../infrastructure/interfaces/request.interface';
import { UpdateUserByAdminRequestBody } from './request-bodies/update-user-by-admin.request-body';
import { UpdateUserRequestBody } from './request-bodies/update-user.request-body';
import { MessageType } from '../infrastructure/response-bodies/message-type.response-body';

@Controller('api')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user data' })
  @ApiResponse({ status: 200, type: Users })
  @Get('users/me/')
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() req: RequestInterface) {
    console.log('req.user: ', req.user);
    return await this.usersService.getUser(req.user.id);
  }

  @ApiOperation({ summary: 'Update user data' })
  @ApiResponse({ status: 200, type: MessageType })
  @Put('users/me/')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Req() req: RequestInterface,
    @Body() body: UpdateUserRequestBody,
  ) {
    return await this.usersService.updateUser(req.user.id, body);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, type: MessageType })
  @Delete('users/me/')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Req() req: RequestInterface) {
    return await this.usersService.deleteUser(req.user.id);
  }

  // admin-panel
  @ApiExcludeEndpoint(true)
  @ApiOperation({ summary: 'Get users data by admin' })
  @ApiResponse({
    status: 200,
    type: Users,
    isArray: true,
  })
  @Get('admin-panel/users/')
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUsers(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('searchKey', new DefaultValuePipe(null)) searchKey?: string,
  ) {
    return await this.usersService.getUsers(offset, limit, searchKey);
  }

  @ApiExcludeEndpoint(true)
  @ApiOperation({ summary: 'Get user data by admin' })
  @ApiResponse({ status: 200, type: Users })
  @Get('admin-panel/users/:userId')
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUserByAdmin(@Param('userId') userId: string) {
    return await this.usersService.getUser(userId);
  }

  @ApiExcludeEndpoint(true)
  @ApiOperation({ summary: "Update user's data by admin" })
  @ApiResponse({
    status: 200,
    type: MessageType,
  })
  @Put('admin-panel/users/:userId')
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUserByAdmin(
    @Param('userId') userId: string,
    @Body() body: UpdateUserByAdminRequestBody,
  ) {
    return await this.usersService.updateUserByAdmin(userId, body);
  }

  @ApiExcludeEndpoint(true)
  @ApiOperation({ summary: "Delete user's data by admin" })
  @ApiResponse({
    status: 200,
    type: MessageType,
  })
  @Delete('admin-panel/users/:userId')
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteUserByAdmin(@Param('userId') userId: string) {
    return await this.usersService.deleteUserByAdmin(userId);
  }
}
