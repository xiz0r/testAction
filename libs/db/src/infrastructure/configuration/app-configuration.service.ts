import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AppConfigurationService {
  private readonly connectionString!: string;
  
  get getConnectionString(): string {
    return this.connectionString;
  }
  
  constructor(private readonly _configService: ConfigService) {
    this.connectionString = this._getConnectionStringFromEnvFile();
  }

  private _getConnectionStringFromEnvFile(): string {
    const connectionString = this._configService.get<string>('MONGODB_DB_URI');

      console.log('connectionString', connectionString);
    
    // if (!connectionString) {
    //   throw new Error('No connection string has been provided in the .env file.');
    // }
    return connectionString;
  }
}