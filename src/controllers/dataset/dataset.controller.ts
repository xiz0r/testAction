import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { DatasetDto } from 'libs/models/dataset';
import { DatasetService } from 'src/services/dataset/dataset.service';
import { DataDto } from 'libs/models/data';
import { Public } from 'libs/auth/src/guards/public/public.guard';
import { GoogleAuthGuard } from 'libs/auth/src/guards/google/google.guard';

@Controller('dataset')
export class DatasetController {
    constructor(
        private readonly datasetService: DatasetService
    ) { }

    @Public()
    @Get(':id')
    async find(@Param() params): Promise<DatasetDto> {
        return this.datasetService.getById(params.id);
    }

    @UseGuards(GoogleAuthGuard)
    @Get('/user/:email')
    async findAll(@Param() params): Promise<DatasetDto[]> {
        return this.datasetService.getByUser(params.email)
    }

    @Public()
    @Get('/:id/:dataId')
    async findData(@Param() params): Promise<DatasetDto> {
        return this.datasetService.getDataVersion(params.id, params.dataId)
    }

    @Post()
    async create(@Body() payload: DatasetDto): Promise<DatasetDto> {
        return await this.datasetService.create(payload);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.datasetService.delete(id)
    }

    @Put()
    async createNewVersion(@Body() payload: DataDto){
        return await this.datasetService.updateVersion(payload)
    }
}