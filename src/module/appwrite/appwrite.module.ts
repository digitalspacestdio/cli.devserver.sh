import { Module } from '@nestjs/common';
import { AppwriteService } from './appwrite.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [AppwriteService],
  exports: [AppwriteService],
})
export class AppwriteModule {}
