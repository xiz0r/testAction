import { Module } from '@nestjs/common';
import { FilesService } from '@app/files';
import { DbModule } from '@app/db';
import { AppController } from './app.controller';
import { FilesController } from './controllers/files/files.controller'
import { UserController } from './controllers/user/user.controller';
import { DatasetController } from './controllers/dataset/dataset.controller';
import { DataController } from './controllers/data/data.controller';
import { AppService } from './app.service';
import { UserService } from './services/user/user.service';
import { DatasetService } from './services/dataset/dataset.service';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthModule } from 'libs/auth/src';
import { GoogleAuthGuard } from 'libs/auth/src/guards/google/google.guard';
import { APP_GUARD } from '@nestjs/core';
import { DriveService } from '@app/drive';
import { HealthModule } from './health/health.module';

@Module({
  imports: [ DbModule, AuthModule, HealthModule ],
  controllers: [AppController, FilesController, DataController, DatasetController, UserController, AuthController],
  providers: [AppService, FilesService, DatasetService, UserService, DriveService,
  //    {
  //   provide: APP_GUARD,
  //   useClass: GoogleAuthGuard,
  // }
],
})
export class AppModule { }