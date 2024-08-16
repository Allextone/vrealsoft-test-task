import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';

import { UserRoleEnum } from '../enums/user-role.enum';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private logger: Logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly configService: ConfigService,

    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const token: string = req.cookies.jwt;
    const userId: string = req.params.userId;

    return new Promise<void>(async (resolve, reject) => {
      const user = await this.checkUserToken(token);

      if (!user) {
        this.logger.error('User not found');
        reject();
      }

      // const adminRootUserId: string =
      //   this.configService.get<string>('DEV_ADMIN_USER_ID');

      // if (user && user.id === adminRootUserId) {
      //   resolve();
      // }

      if (
        userId &&
        user &&
        user.id !== userId &&
        user.role === UserRoleEnum.USER
      ) {
        this.logger.error('User id not match with id from auth token');
        reject();
      }

      resolve();
    })
      .then(() => {
        const data = this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_TOKEN_SECRET_KEY'),
        });

        req.user = { id: data.user.id, role: data.user.role };

        return true;
      })
      .catch(() => {
        throw new UnauthorizedException({ message: 'You must be logged in' });
      });
  }

  private async checkUserToken(token: string) {
    const userObj = JSON.parse(await this.redisService.getClient().get(token));
    return userObj ? userObj.user : null;
  }
}
