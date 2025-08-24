export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const noop = (..._args: unknown[]) => {};

let currentLevel: LogLevel = 'warn';

export const logger = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
  log: (_level: LogLevel, ..._args: unknown[]) => {},
};

export function setLoggerConfig(level: LogLevel) {
  currentLevel = level;
  const order: Record<LogLevel, number> = { error: 0, warn: 1, info: 2, debug: 3 };
  const enabled = (lvl: LogLevel) => order[lvl] <= order[currentLevel];
  logger.debug = enabled('debug') ? console.debug.bind(console, '[DEBUG]') : noop;
  logger.info = enabled('info') ? console.info.bind(console, '[INFO]') : noop;
  logger.warn = enabled('warn') ? console.warn.bind(console, '[WARN]') : noop;
  logger.error = enabled('error') ? console.error.bind(console, '[ERROR]') : noop;
  logger.log = (lvl: LogLevel, ...args: unknown[]) => {
    if (enabled(lvl)) {
      (console as any)[lvl]?.(...args);
    }
  };
}

