export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const noop = (..._args: unknown[]) => undefined;

let currentLevel: LogLevel = 'warn';

const methods: Record<LogLevel, (...args: unknown[]) => void> = {
  debug: (...args: unknown[]) => console.debug(...args),
  info: (...args: unknown[]) => console.info(...args),
  warn: (...args: unknown[]) => console.warn(...args),
  error: (...args: unknown[]) => console.error(...args),
};

const withTag = (
  fn: (...args: unknown[]) => void,
  tag: string
): ((...args: unknown[]) => void) => {
  return (...args: unknown[]) => fn(tag, ...args);
};

export const logger = {
  debug: noop as (...args: unknown[]) => void,
  info: noop as (...args: unknown[]) => void,
  warn: noop as (...args: unknown[]) => void,
  error: noop as (...args: unknown[]) => void,
  log: (_level: LogLevel, ..._args: unknown[]) => undefined,
};

export function setLoggerConfig(level: LogLevel) {
  currentLevel = level;
  const order: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };
  const enabled = (lvl: LogLevel) => order[lvl] <= order[currentLevel];
  logger.debug = enabled('debug') ? withTag(methods.debug, '[DEBUG]') : noop;
  logger.info = enabled('info') ? withTag(methods.info, '[INFO]') : noop;
  logger.warn = enabled('warn') ? withTag(methods.warn, '[WARN]') : noop;
  logger.error = enabled('error') ? withTag(methods.error, '[ERROR]') : noop;
  logger.log = (lvl: LogLevel, ...args: unknown[]) => {
    if (enabled(lvl)) {
      methods[lvl](...args);
    }
  };
}
