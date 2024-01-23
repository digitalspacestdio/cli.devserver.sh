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

interface VmCreateDtoTenant extends VmCreateDto {
  tenant: string;
}

interface VmDestroyDto {
  ids: Array<String>;
}

@Injectable()
export class VmService {
  constructor(private appwrite: AppwriteService) {}

  public async getVm(vmId: string): Promise<Models.Document> {
    return await (await this.appwrite.getDatabases()).getDocument(this.appwrite.databaseId, this.appwrite.vmCollectionId, vmId);
  }

  public async getVmList() {
    return await (await this.appwrite.getDatabases()).listDocuments(this.appwrite.databaseId, this.appwrite.vmCollectionId);
  }

  public async getTenantList() {
    return await (await this.appwrite.getDatabases()).listDocuments(this.appwrite.databaseId, this.appwrite.tenantCollectionId);
  }

  public async createVm(dto: VmCreateDto) {

    const resp = await (await this.appwrite.getFunctions()).createExecution('VmCreate', JSON.stringify(dto), false);

    if (resp.statusCode > 200) {
      if (resp.response) {
        throw JSON.parse(resp.response)?.error || "Execution status: " + resp.status;
      }
    }

    return JSON.parse(resp.response)?.vm as Models.Document;
  }

  public async destroyVm(dto: VmDestroyDto): Promise<Array<Models.Document>> {
    const resp = await (await this.appwrite.getFunctions()).createExecution('VmDestroy', JSON.stringify(dto), false);
    if (resp.statusCode > 299) {
      const error = resp.response ? JSON.parse(resp.response)?.error : null;

      throw error || "Execution status: " + resp.status;
    }

    if (!resp?.response) {
      throw "Empty response!";
    }

    return JSON.parse(resp.response)?.tasks as Array<Models.Document>;

    //return await (await this.appwrite.getDatabases()).deleteDocument(this.appwrite.databaseId, this.appwrite.vmCollectionId, dto.id);
  }
}
