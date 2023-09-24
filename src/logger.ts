export const level = (): string => {
  const logLevel = process?.env?.NODE_LOG_LEVEL || null;
  const nodeEnv = process?.env?.NODE_ENV || 'development';

  if (!logLevel && 'production' == nodeEnv) {
    return 'warn';
  }

  if (logLevel) {
    switch (logLevel) {
      case 'verbose':
      case 'trace':
        return 'trace';
      case 'debug':
        return 'debug';
      case 'info':
        return 'info';
      case 'warn':
      case 'warning':
        return 'warn';
      case 'error':
        return 'error';
    }
  }

  return 'info';
};

export const transport = (): any => {
  if ('json' != process?.env?.NODE_LOG_FORMAT) {
    return {
      target: 'pino-pretty',
      options: {
        singleLine: true,
        translateTime: 'SYS:standard',
      },
    };
  }

  return undefined;
};
