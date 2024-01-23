import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Client, Account, Functions, Databases, Models } from 'node-appwrite';

export class AppwriteUnauthorizedException {
  constructor(public code: number, public message: string) {}
}

interface JwtToken {
  jwt: string;
  expire_at: string;
}

class AppwriteClient extends Client {
  protected endpoint: string;
  protected headers: object;
  protected selfSigned: object;
  protected tenant: Models.Document;
  constructor() {
    super()
  }

  public getTenant(): Models.Document
  {
    return this.tenant;
  }

  public addTenant(tenant: Models.Document): AppwriteClient
  {
    this.tenant = tenant;
    this.headers['x-appwrite-tenant-id'] = tenant.$id
    return this;
  }
}

class AppwriteFunctions extends Functions
{
  public client: AppwriteClient;
  createExecution(functionId: string, data?: string, async?: boolean): Promise<Models.Execution>
  {
    if (this.client.getTenant().$id) {
      data = JSON.parse(data)
      data["tenant"] = this.client.getTenant().$id
      data = JSON.stringify(data);
    }

    return super.createExecution(functionId, data, async);
  }
}

@Injectable()
export class AppwriteService {
  private client: AppwriteClient;
  private account: Account;
  private functions: AppwriteFunctions;
  private databases: Databases;
  private jwtToken: JwtToken;

  public readonly projectId = '65909f6f4095b002cb91';
  public readonly databaseId = '65909fa9d261365b5105';
  public readonly vmCollectionId = '6590a05a90d5742cc73e'
  public readonly tenantCollectionId = 'tenant'

  constructor(private authService: AuthService) {}

  public async getJwtToken(): Promise<JwtToken>
  {
    if (undefined === this.jwtToken) {
      const token = await this.authService.getJwtToken() as JwtToken;
      if (!token) {
        throw new AppwriteUnauthorizedException(401, 'Unathorized request, please log-in');
      }
      this.jwtToken = token
    }

    return this.jwtToken;
  }


  public async getClient(): Promise<AppwriteClient> {
    if (undefined === this.client) {
      const token = await this.getJwtToken();
      this.client = new AppwriteClient();
      this.client
        .setEndpoint('https://mitm.devserver.sh/v1')
        .setProject(this.projectId)
        .setJWT(token.jwt)
        .setSelfSigned(false);

        const tenants = await (await this.getDatabases()).listDocuments(this.databaseId, this.tenantCollectionId);
        if (tenants.total) {
          this.client.addTenant(tenants.documents[0]);
        }
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

  public async getFunctions(): Promise<AppwriteFunctions> {
    if (undefined === this.functions) {
      this.functions = new AppwriteFunctions(await this.getClient());
    }

    return this.functions;
  }
}
