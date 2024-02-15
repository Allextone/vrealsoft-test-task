import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { AppLogger } from '../infrastructure/logger/logger';
import { normalizeData } from 'src/helpers/helpers-functions';

import { DataNotFoundException } from '../infrastructure/exceptions/data-not-found.exceptions';
import { NotOwnerException } from '../infrastructure/exceptions/not-owner.exception';

import { Notes } from './notes.entity';
import { NotesNormalizeEntity } from '../infrastructure/normalize-entities/notes.normalize-entity';

import { MessageType } from '../infrastructure/response-bodies/message-type.response-body';
import { CreateNoteInterface } from './interfaces/create-note.interface';
import { UpdateNoteInterface } from './interfaces/update-note.interface';

import { CreateNoteRequestBody } from './request-bodies/create-note.request-body';
import { UpdateNoteRequestBody } from './request-bodies/update-note.request-body';

@Injectable()
export class NotesService {
  private logger = new AppLogger('NotesService');

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(Notes)
    private notesRepository: Repository<Notes>,
  ) {}

  private async getOne(
    userId: string,
    noteId: string,
    traceId: string,
    strict = true,
  ): Promise<NotesNormalizeEntity> {
    const note: NotesNormalizeEntity = normalizeData(
      await this.notesRepository.findOne({
        where: normalizeData({ id: noteId, userId }, false),
        comment: traceId,
      }),
    );

    if (!note && strict) {
      throw new DataNotFoundException('Note does not found or not exist');
    }

    return note;
  }

  private async getAll(traceId: string): Promise<NotesNormalizeEntity[]> {
    return normalizeData(
      await this.notesRepository.find({
        comment: traceId,
        order: { created_date: 'ASC' },
      }),
    );
  }

  private async getAllByUserId(
    userId: string,
    traceId: string,
  ): Promise<NotesNormalizeEntity[]> {
    return normalizeData(
      await this.notesRepository.find({
        where: normalizeData({ userId }, false),
        comment: traceId,
        order: { created_date: 'ASC' },
      }),
    );
  }

  private async create(
    body: CreateNoteInterface,
    traceId: string,
  ): Promise<MessageType> {
    await this.notesRepository
      .createQueryBuilder('notes')
      .insert()
      .values(normalizeData(body, false))
      .comment(`traceId: ${traceId}`)
      .execute();

    return { message: true };
  }

  private async update(
    noteId: string,
    body: UpdateNoteInterface,
    traceId: string,
  ): Promise<MessageType> {
    await this.notesRepository
      .createQueryBuilder('notes')
      .update()
      .set(normalizeData(body, false))
      .where('notes.id = :noteId', { noteId })
      .comment(`traceId: ${traceId}`)
      .execute();

    return { message: true };
  }

  private async delete(noteId: string, traceId: string): Promise<MessageType> {
    await this.notesRepository
      .createQueryBuilder('notes')
      .delete()
      .where('notes.id = :noteId', { noteId })
      .comment(`traceId: ${traceId}`)
      .execute();

    return { message: true };
  }

  async getNote(
    userId: string,
    noteId: string,
    traceId: string,
  ): Promise<NotesNormalizeEntity> {
    return await this.getOne(userId, noteId, traceId);
  }

  async getNotesList(
    userId: string,
    traceId: string,
  ): Promise<NotesNormalizeEntity[]> {
    return await this.getAllByUserId(userId, traceId);
  }

  async createNote(
    userId: string,
    body: CreateNoteRequestBody,
    traceId: string,
  ): Promise<MessageType> {
    const { title, description } = body;

    const options: CreateNoteInterface = {
      title,
      description,
      userId,
    };

    await this.create(options, traceId);
    return { message: true };
  }

  async updateNote(
    userId: string,
    noteId: string,
    body: UpdateNoteRequestBody,
    traceId: string,
  ): Promise<MessageType> {
    const { title, description } = body;

    const note: NotesNormalizeEntity = await this.getOne(
      userId,
      noteId,
      traceId,
    );

    const options: UpdateNoteInterface = {};
    if (title) Object.assign(options, { title });
    if (description) Object.assign(options, { description });

    await this.update(note.id, options, traceId);

    return { message: true };
  }

  async deleteNote(
    userId: string,
    noteId: string,
    traceId: string,
  ): Promise<MessageType> {
    await this.getOne(userId, noteId, traceId);

    await this.delete(noteId, traceId);
    return { message: true };
  }

  // admin panel
  async getAllNotes(traceId: string): Promise<NotesNormalizeEntity[]> {
    return await this.getAll(traceId);
  }
}
