import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DbModule } from '@app/db';

@Module({
  imports: [TerminusModule, HttpModule, DbModule],
  controllers: [HealthController],
})
export class HealthModule {}