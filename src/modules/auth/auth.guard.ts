import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';


@Injectable()
export class BearerExampleAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToHttp().getRequest();
    const token = this.checkToken(client);
    if (!token) throw new UnauthorizedException()
    if (this.getBearerToken(token as string) === 'example') return true;
    throw new UnauthorizedException();
  }
  private checkToken(client: any): string | boolean {
    if (!client.headers.authorization || client.headers.authorization.length < 8) throw new UnauthorizedException();
    return client.headers.authorization;
  }
  private getBearerToken(token: string): string {
    return token.split(' ')[1];
  }
}

@Injectable()
export class BasicExampleAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const API_BA_USERNAME = 'example-user'
    const API_BA_PASSWORD = 'example-password'

    const client = context.switchToHttp().getRequest();
    if (!this.checkToken(client, API_BA_USERNAME, API_BA_PASSWORD)) throw new UnauthorizedException();
    return true;
  }
  checkToken(client: any, valid_username: string, valid_password: string): boolean {
    if (!client.headers.authorization || client.headers.authorization.length < 8) throw new UnauthorizedException();
    const [type, token] = client.headers.authorization.split(' ');
    if (type !== 'Basic') throw new UnauthorizedException();
    const [username, password] = Buffer.from(token, 'base64').toString().split(':');
    if (username !== valid_username || password !== valid_password) throw new UnauthorizedException();
    return true;
  }
}
