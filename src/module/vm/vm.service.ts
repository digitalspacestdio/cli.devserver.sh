import { Injectable } from '@nestjs/common';
import { AppwriteService } from '../appwrite/appwrite.service';
import { ID, Models } from 'node-appwrite';

interface VmCreateDto {
  name: string;
  size: string;
  username: string;
  password_hash: string;
  code_server_password_hash: string;
  public_port: number[];
  public_port_username: string;
  public_port_password_hash: string;
}

interface VmDestroyDto {
  id: string;
}

@Injectable()
export class VmService {
  constructor(private appwrite: AppwriteService) {}

  public async getVm(vmId: string): Promise<Models.Document> {
    return await (await this.appwrite.getDatabases()).getDocument(this.appwrite.databaseId, this.appwrite.vmCollectionId, vmId);
  }

  public async getVmList() {
    const vmList = await (await this.appwrite.getDatabases()).listDocuments(this.appwrite.databaseId, this.appwrite.vmCollectionId);

    return vmList;
  }

  public async createVm(dto: VmCreateDto) {
    return await (await this.appwrite.getDatabases()).createDocument(this.appwrite.databaseId, this.appwrite.vmCollectionId, ID.unique(), dto);
  }

  public async destroyVm(dto: VmDestroyDto) {
    return await (await this.appwrite.getDatabases()).deleteDocument(this.appwrite.databaseId, this.appwrite.vmCollectionId, dto.id);
  }
}
