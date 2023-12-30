import { Injectable } from '@nestjs/common';
import { AppwriteService } from '../appwrite/appwrite.service';
import { ID } from 'node-appwrite';

interface VmCreateDto {
  name: string;
  size: string;
  username: string;
  password_hash: string;
  code_server_password_hash: string;
  public_ports: number[];
  public_ports_auth_username: string;
  public_ports_auth_password_hash: string;
}

interface VmDestroyDto {
  id: string;
}

@Injectable()
export class VmService {
  private readonly collectionId = 'vm';
  constructor(private appwrite: AppwriteService) {}

  public async getVm(vmId: string) {
    return await (await this.appwrite.getDatabases()).getDocument(this.appwrite.databaseId, this.collectionId, vmId);
  }

  public async getVmList() {
    const vmList = await (await this.appwrite.getDatabases()).listDocuments(this.appwrite.databaseId, this.collectionId);

    return vmList;
  }

  public async createVm(dto: VmCreateDto) {
    return await (await this.appwrite.getDatabases()).createDocument(this.appwrite.databaseId, this.collectionId, ID.unique(), dto);
  }

  public async destroyVm(dto: VmDestroyDto) {
    return await (await this.appwrite.getDatabases()).deleteDocument(this.appwrite.databaseId, this.collectionId, dto.id);
  }
}
