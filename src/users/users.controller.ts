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
import { UsersService } from './users.service';
import { UsersNormalizeEntity } from '../infrastructure/normalize-entities/users.normalize-entity';
import { JwtAuthGuard } from '../infrastructure/guards/jwt-auth.guard';
import { MessageType } from '../infrastructure/response-bodies/message-type.response-body';
import { Roles } from '../infrastructure/decorators/roles.decorator';
import { UserRoleEnum } from '../infrastructure/enums/user-role.enum';
import { RolesGuard } from '../infrastructure/guards/roles.guard';
import { RequestInterface } from '../infrastructure/interfaces/request.interface';
import { UpdateUserByAdminRequestBody } from './request-bodies/update-user-by-admin.request-body';
import { UpdateUserRequestBody } from './request-bodies/update-user.request-body';

@Controller('api')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user data' })
  @ApiResponse({ status: 200, type: UsersNormalizeEntity })
  @Get('users/:userId/')
  @UseGuards(JwtAuthGuard)
  getUser(@Req() req: RequestInterface, @Param('userId') userId: string) {
    return this.usersService.getUser(userId, req.traceId);
  }

  @ApiOperation({ summary: 'Update user data' })
  @ApiResponse({ status: 200, type: MessageType })
  @Put('users/:userId/')
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Req() req: RequestInterface,
    @Param('userId') userId: string,
    @Body() body: UpdateUserRequestBody,
  ) {
    return this.usersService.updateUser(userId, body, req.traceId);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, type: MessageType })
  @Delete('users/:userId/')
  @UseGuards(JwtAuthGuard)
  deleteUser(@Req() req: RequestInterface, @Param('userId') userId: string) {
    return this.usersService.deleteUser(userId, req.traceId);
  }

  // admin-panel
  @ApiExcludeEndpoint(true)
  @ApiOperation({ summary: 'Get users data by admin' })
  @ApiResponse({
    status: 200,
    type: UsersNormalizeEntity,
    isArray: true,
  })
  @Get('admin-panel/users/')
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getUsers(
    @Req() req: RequestInterface,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('searchKey', new DefaultValuePipe(null)) searchKey?: string,
  ) {
    return this.usersService.getUsers(req.traceId, offset, limit, searchKey);
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
  updateUserByAdmin(
    @Req() req: RequestInterface,
    @Param('userId') userId: string,
    @Body() body: UpdateUserByAdminRequestBody,
  ) {
    return this.usersService.updateUserByAdmin(userId, body, req.traceId);
  }
}
