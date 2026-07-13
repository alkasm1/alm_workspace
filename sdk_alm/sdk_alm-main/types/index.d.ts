export interface ALMConfig {
  endpoint: string;
}

export interface SystemModule {
  info(deviceId?: string): Promise<any>;
  exec(deviceId: string, command: string): Promise<any>;
}

export interface TasksModule {
  run(
    deviceId: string,
    taskName: string,
    payload?: any
  ): Promise<any>;
}

export class ALMClient {
  constructor(config: ALMConfig);

  connect(): Promise<void>;
  disconnect(): Promise<void>;

  on(event: string, handler: (...args: any[]) => void): void;
  off(event: string, handler: (...args: any[]) => void): void;
  once(event: string, handler: (...args: any[]) => void): void;

  system: SystemModule;
  tasks: TasksModule;

  getEvents(): any[];
  getEventCount(): number;
  getEventStats(): any;
}

export class ALM {
  constructor(config: ALMConfig);
}
