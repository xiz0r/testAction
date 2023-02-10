import { AuthService } from '@app/auth';
import { keysToLowerCase } from '@app/files/utils/utils';
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { Mimetypes } from 'libs/models/mime-types';
const XLSX = require("xlsx")

@Injectable()
export class DriveService {

    constructor(private readonly authService: AuthService) {

    }

    public async getFile(fileId: string, mimeType: string) {
        const service = google.drive({ version: 'v3', auth: this.authService.oauthClient })
        try {
            if (mimeType === Mimetypes.GoogleSheets) {
                const exportFile = await service.files.export({
                    'fileId': fileId,
                    'mimeType': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                }, {
                    responseType: 'arraybuffer'
                })
                return exportFile.data
            } else if (mimeType === Mimetypes.OpenXML) {
                const file = await service.files.get({
                    fileId: fileId, alt: "media"
                }, {
                    responseType: 'arraybuffer'
                })
                return file.data
            } else {
                const file = await service.files.get({
                    fileId: fileId, alt: "media"
                }, {
                    responseType: 'text'
                })
                return file.data
            }
        } catch (err) {
            console.error('Error with get file', err);
            throw err;
        }
    }

}
