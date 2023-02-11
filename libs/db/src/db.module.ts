import { UserRepository } from './repositories/user.repository';
import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { DbService } from './db.service';
import { DataModel } from './schemas/data.schema';
import { DatasetModel } from './schemas/dataset.schema';
import { UserSchema } from './schemas/user.schema';
import { DataRepository } from './repositories/data.repository';
import { DatasetRepository } from './repositories/dataset.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({   
      envFilePath: ['.env','.env.dev', '.env.prod'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {

        return  {
          uri: configService.get('MONGODB_DB_URI'),
          dbName: 'data-manager'
        } as MongooseModuleOptions;
      }
      
    }),
    MongooseModule.forFeature(
      [
        { name: 'User', schema: UserSchema },
        { name: 'Dataset', schema: DatasetModel },
        { name: 'Data', schema: DataModel }
      ]
    )
  ],
  providers: [DbService, DataRepository, DatasetRepository, UserRepository],
  exports: [DbService, DataRepository, DatasetRepository, UserRepository],
})
export class DbModule { }
