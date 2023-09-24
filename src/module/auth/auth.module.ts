import { Module } from '@nestjs/common';
import { LoginCommand } from './commands';
import { AuthService } from './auth.service';

@Module({
  providers: [LoginCommand, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
