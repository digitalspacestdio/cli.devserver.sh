import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Client, Account, Functions, Databases, Models } from 'node-appwrite';

export class AppwriteUnauthorizedException {}

@Injectable()
export class AppwriteService {
  private client: Client;
  private account: Account;
  private functions: Functions;
  private databases: Databases;

  public readonly projectId = 'devserversh';
  public readonly databaseId = 'devserversh';

  constructor(private authService: AuthService) {}

  public async getClient(): Promise<Client> {
    if (undefined === this.client) {
      const token = await this.authService.getJwtToken();
      if (!token) {
        throw new AppwriteUnauthorizedException();
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
