#!/usr/bin/env node

import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module.cli';
import axios from 'axios';
import * as curlirize from 'axios-curlirize';
import { level } from './logger';

async function bootstrap() {
  if ('trace' === level()) {
    curlirize(axios);
  }

  return await CommandFactory.run(AppModule, 'trace' === level() ? { logger: ['debug'] } : { logger: ['warn'] });
}

bootstrap();
