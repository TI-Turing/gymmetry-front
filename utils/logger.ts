type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const noop = (..._args: unknown[]) => {};

export const logger = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
  log: (_level: LogLevel, ..._args: unknown[]) => {},
};
