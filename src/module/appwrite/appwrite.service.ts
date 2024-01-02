import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Client, Account, Functions, Databases, Models } from 'node-appwrite';

export class AppwriteUnauthorizedException {
  constructor(public code: number, public message: string) {}
}

@Injectable()
export class AppwriteService {
  private client: Client;
  private account: Account;
  private functions: Functions;
  private databases: Databases;

  public readonly projectId = '65909f6f4095b002cb91';
  public readonly databaseId = '65909fa9d261365b5105';
  public readonly vmCollectionId = '6590a05a90d5742cc73e'

  constructor(private authService: AuthService) {}

  public async getClient(): Promise<Client> {
    if (undefined === this.client) {
      const token = await this.authService.getJwtToken();
      if (!token) {
        throw new AppwriteUnauthorizedException(401, 'Unathorized request, please log-in');
      }

      this.client = new Client();
      this.client
        .setEndpoint('https://appwrite.devserver.sh/v1')
        .setProject(this.projectId)
        .setJWT(token.jwt)
        .setSelfSigned(false);
    }

    return this.client;
  }

  public async getAccount(): Promise<Account> {
    if (undefined === this.account) {
      this.account = new Account(await this.getClient());
    }

    return this.account;
  }

  public async getDatabases(): Promise<Databases> {
    if (undefined === this.databases) {
      this.databases = new Databases(await this.getClient());
    }

    return this.databases;
  }
}
