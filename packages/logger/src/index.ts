/**
 * Dashboard Capsule AI — Structured OpenTelemetry Logger Wrapper
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogPayload {
  message: string;
  context?: Record<string, unknown>;
  traceId?: string;
  timestamp?: string;
}

export class Logger {
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  private format(level: LogLevel, payload: LogPayload) {
    return JSON.stringify({
      level,
      service: this.serviceName,
      timestamp: payload.timestamp || new Date().toISOString(),
      message: payload.message,
      traceId: payload.traceId,
      context: payload.context || {},
    });
  }

  public debug(message: string, context?: Record<string, unknown>) {
    console.debug(this.format('debug', { message, context }));
  }

  public info(message: string, context?: Record<string, unknown>) {
    console.info(this.format('info', { message, context }));
  }

  public warn(message: string, context?: Record<string, unknown>) {
    console.warn(this.format('warn', { message, context }));
  }

  public error(message: string, context?: Record<string, unknown>) {
    console.error(this.format('error', { message, context }));
  }
}

export const logger = new Logger('global');
