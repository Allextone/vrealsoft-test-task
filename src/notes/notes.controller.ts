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
  Post,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../infrastructure/guards/jwt-auth.guard';
import { MessageType } from '../infrastructure/response-bodies/message-type.response-body';
import { Roles } from '../infrastructure/decorators/roles.decorator';
import { UserRoleEnum } from '../infrastructure/enums/user-role.enum';
import { RolesGuard } from '../infrastructure/guards/roles.guard';
import { RequestInterface } from '../infrastructure/interfaces/request.interface';

import { NotesService } from './notes.service';
import { UsersNormalizeEntity } from '../infrastructure/normalize-entities/users.normalize-entity';

import { CreateNoteRequestBody } from './request-bodies/create-note.request-body';
import { UpdateNoteRequestBody } from './request-bodies/update-note.request-body';

@Controller('api')
@ApiTags('Notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @ApiOperation({ summary: 'Get note by noteId' })
  @ApiResponse({ status: 200, type: UsersNormalizeEntity })
  @Get('users/:userId/notes/:noteId/')
  @UseGuards(JwtAuthGuard)
  getNote(
    @Req() req: RequestInterface,
    @Param('userId') userId: string,
    @Param('noteId') noteId: string,
  ) {
    return this.notesService.getNote(userId, noteId, req.traceId);
  }

  @ApiOperation({ summary: 'Get list of notes by userId' })
  @ApiResponse({ status: 200, type: UsersNormalizeEntity })
  @Get('users/:userId/notes-list')
  @UseGuards(JwtAuthGuard)
  getNotesList(@Req() req: RequestInterface, @Param('userId') userId: string) {
    return this.notesService.getNotesList(userId, req.traceId);
  }

  @ApiOperation({ summary: 'Create note' })
  @ApiResponse({ status: 200, type: UsersNormalizeEntity })
  @Post('users/:userId/notes')
  @UseGuards(JwtAuthGuard)
  createNote(
    @Req() req: RequestInterface,
    @Param('userId') userId: string,
    @Body() body: CreateNoteRequestBody,
  ) {
    return this.notesService.createNote(userId, body, req.traceId);
  }

  @ApiOperation({ summary: 'Update note' })
  @ApiResponse({ status: 200, type: MessageType })
  @Put('users/:userId/notes/:noteId/')
  @UseGuards(JwtAuthGuard)
  updateNote(
    @Req() req: RequestInterface,
    @Param('userId') userId: string,
    @Param('noteId') noteId: string,
    @Body() body: UpdateNoteRequestBody,
  ) {
    return this.notesService.updateNote(userId, noteId, body, req.traceId);
  }

  @ApiOperation({ summary: 'Delete note' })
  @ApiResponse({ status: 200, type: MessageType })
  @Delete('users/:userId/notes/:noteId/')
  @UseGuards(JwtAuthGuard)
  deleteNote(
    @Req() req: RequestInterface,
    @Param('userId') userId: string,
    @Param('noteId') noteId: string,
  ) {
    return this.notesService.deleteNote(userId, noteId, req.traceId);
  }

  @ApiOperation({ summary: 'Get list of all notes' })
  @ApiResponse({ status: 200, type: MessageType })
  @Get('admin-panel/notes-list/')
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getAllNotes(@Req() req: RequestInterface) {
    return this.notesService.getAllNotes(req.traceId);
  }
}
