import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { hashSync, compareSync, genSaltSync } from 'bcryptjs';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';

import { Users } from '../users/users.entity';
import { UsersService } from '../users/users.service';

import { MessageType } from '../infrastructure/response-bodies/message-type.response-body';
import { LoginResponseBody } from './response-bodies/login.response-body';

import { validatePassword } from '../infrastructure/validators/password.validator';
import { validateEmail } from '../infrastructure/validators/email.validator';

import { JwtTokenPayloadInterface } from './interface/jwt-token-payload.interface';
import { LoginInterface } from './interface/login.interface';
import { RegistrationInterface } from './interface/registration.interface';

import { NotValidPasswordException } from '../infrastructure/exceptions/not-valid-password.exception';
import { NotValidLoginDataException } from '../infrastructure/exceptions/not-valid-login-data.exception';
import { DataAlreadyExistException } from '../infrastructure/exceptions/data-already-exist.exception';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,

    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,

    private jwtService: JwtService,

    private redisService: RedisService,
  ) {}

  async login(body: LoginInterface): Promise<LoginResponseBody> {
    const { email, password } = body;

    if (!validatePassword(password)) {
      throw new NotValidLoginDataException('Email or password is not valid');
    }

    const user: Users = await this.usersService.getUserByEmail(email);

    if (!user) {
      this.logger.error(`[login]: user is not exist, user: ${user}`);
      throw new NotValidLoginDataException('Email or password is not valid');
    }

    const valid: boolean = compareSync(password, user.password);
    if (!valid) {
      this.logger.error('[login]: password is not valid');
      throw new NotValidLoginDataException('Email or password is not valid');
    }

    return this.generateToken(user);
  }

  async registration(body: RegistrationInterface): Promise<LoginResponseBody> {
    const { email, password, firstName, lastName } = body;
    console.log(body);
    if (!validatePassword(password)) {
      throw new NotValidPasswordException('Password is not valid');
    }

    const userWithCurrentEmail: Users = await this.usersService.getUserByEmail(
      email,
    );

    if (userWithCurrentEmail) {
      throw new DataAlreadyExistException('User with such email already exist');
    }

    const salt = genSaltSync(12);
    const hashedPassword = hashSync(password, salt);

    await this.usersService.createUser({
      firstName: firstName,
      lastName: lastName,
      email: validateEmail(email),
      password: hashedPassword,
    });

    const user: Users = await this.usersService.getUserByEmail(email);

    return this.generateToken(user);
  }

  async logout(authorization: string): Promise<MessageType> {
    await this.redisService.getClient().del(authorization);
    return { message: true };
  }

  private async generateToken(user: Users): Promise<LoginResponseBody> {
    try {
      const options: JwtSignOptions = {
        expiresIn: `${this.configService.get<string>(
          'JWT_TOKEN_TTL_IN_SECONDS',
        )}s`,
        secret: this.configService.get<string>('JWT_TOKEN_SECRET_KEY'),
      };

      const payload: JwtTokenPayloadInterface = {
        email: user.email,
        user: { id: user.id, role: user.role },
      };

      const token: string = this.jwtService.sign(payload, options);
      if (!token) {
        // throw new TokenGenerationException();
        throw new Error('Something went wrong during token generation');
      }

      await this.redisService
        .getClient()
        .set(token, JSON.stringify({ id: user.id, user }));

      return { token, id: user.id, role: user.role };
    } catch (err) {
      this.logger.error(`Failed to generate token. Reason: ${err.message}.`);
      throw new Error('Failed to generate token');
    }
  }
}
