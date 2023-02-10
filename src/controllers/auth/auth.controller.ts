import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from 'libs/auth/src/auth.service';
import { GoogleAuthGuard } from 'libs/auth/src/guards/google/google.guard';
import { Public } from 'libs/auth/src/guards/public/public.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Public()
    @Get('login')
    async login(@Query('code') code: string) {
      return this.authService.getAccessToken(code);
    }

    @UseGuards(GoogleAuthGuard)
    @Get('user')
    async user(@Req() req) {
      return this.authService.getUser(req.user.access_token);
    }

    @Public()
    @Get('refresh')
    async refresh(@Query('token') token: string) {
      return this.authService.refreshAccessToken(token);
    }
}