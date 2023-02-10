import { UserRepository } from './repositories/user.repository';
import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { AppConfigurationModule } from '@app/db/infrastructure/configuration/app-configuration.module';
import { AppConfigurationService } from '@app/db/infrastructure/configuration/app-configuration.service';
import { DbService } from './db.service';
import { DataModel } from './schemas/data.schema';
import { DatasetModel } from './schemas/dataset.schema';
import { UserSchema } from './schemas/user.schema';
import { DataRepository } from './repositories/data.repository';
import { DatasetRepository } from './repositories/dataset.repository';

@Module({
  imports: [
    AppConfigurationModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigurationModule],
      inject: [AppConfigurationService],
      useFactory: (appConfigService: AppConfigurationService) => {
        const options: MongooseModuleOptions = {
          uri: appConfigService.getConnectionString,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
        return options;
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
