import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { VmModule } from './module/vm/vm.module';
import { LoggerModule, Logger } from 'nestjs-pino';
import { AppwriteModule } from './module/appwrite/appwrite.module';
import { level, transport } from './logger';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: level(),
        transport: transport(),
        timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
      },
    }),
    AuthModule,
    AppwriteModule,
    VmModule,
  ],
  providers: [],
})
export class AppModule {}
