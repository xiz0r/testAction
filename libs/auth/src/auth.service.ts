import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';

@Injectable()
export class AuthService {
    oauthClient: Auth.OAuth2Client;

    constructor(private readonly configService: ConfigService) {
        const keys = this.getGoogleKeys()
        this.oauthClient = new google.auth.OAuth2(keys.googleClientId, keys.googleClientSecret, 'http://localhost:5173');
    }

    async getTokenInfo(accessToken: string) {
        const tokenInfo = await this.oauthClient.getTokenInfo(accessToken);
        return { ...tokenInfo, access_token: accessToken };
    }

    async getAccessToken(code: string) {
        try {
            const token = await this.oauthClient.getToken(code)
            return token.tokens;
        } catch (err) {
            throw new UnauthorizedException();
        }
    }

    async getUser(accessToken: string) {
        const userInfoClient = google.oauth2('v2').userinfo;

        this.oauthClient.setCredentials({
            access_token: accessToken,
        });

        const userInfoResponse = await userInfoClient.get({
            auth: this.oauthClient,
        });
        return userInfoResponse.data;
    }

    async refreshAccessToken(refreshtoken: string) {
        try {
            this.oauthClient.setCredentials({
                refresh_token: refreshtoken,
            });
            const { credentials } = await this.oauthClient.refreshAccessToken();
            return credentials;
        } catch (err) {
            throw new UnauthorizedException();
        }
    }

    private getGoogleKeys() {
        const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID')
        const googleClientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET')
        return { googleClientId, googleClientSecret }
    }
}