import { Module } from '@nestjs/common';
import { VmListCommand, VmCreateCommand, VmUpdateCommand, VmDestroyCommand } from './commands';
import { VmService } from './vm.service';
import { AppwriteModule } from '../appwrite/appwrite.module';

@Module({
  imports: [AppwriteModule],
  providers: [VmService, VmListCommand, VmCreateCommand, VmUpdateCommand, VmDestroyCommand],
  exports: [VmService],
})
export class VmModule {}
