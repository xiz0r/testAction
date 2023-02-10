import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google/google.guard';
import { GoogleOauthStrategy } from './passport/google-oauth.strategy';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [AuthService, GoogleOauthStrategy, GoogleAuthGuard],
  exports: [AuthService, GoogleOauthStrategy, GoogleAuthGuard],
})
export class AuthModule {}
