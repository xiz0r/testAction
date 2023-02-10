import { FilesService } from '@app/files';
import { Controller, Get, Param, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Data } from "@app/db/models/data.model"
import { DriveService } from '@app/drive';

@Controller('files')
export class FilesController {
    constructor(private filesService: FilesService, private driveService: DriveService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        const data: Partial<Data> = this.filesService.generateData(file.buffer, file.mimetype)
        return data
    }

    @Get('drive/:id')
    async getDriveFile(@Param() params, @Query() query) {
        const fileId = params.id
        const mimeType = query.mimeType
        const file: any = await this.driveService.getFile(fileId, mimeType)
        const data = this.filesService.generateData(file, mimeType)
        return data
      }

}

