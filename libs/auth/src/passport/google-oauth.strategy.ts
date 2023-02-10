import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(
  Strategy,
  'google-oauth',
) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(token: any) {
    try {
      const tokenInfo = await this.authService.getTokenInfo(token);

      if (!tokenInfo) {
        throw new UnauthorizedException();
      }
      return tokenInfo;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
