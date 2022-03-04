import { usePproto } from "../pproto/pproto-react";
import { PprotoConnection, PprotoSubscription } from "../pproto/pproto";

export interface HelloAnswer {
  value: string;
}

export interface TestMessage {
  uuid: string;
  beginTest: boolean;
  endTest: boolean;
}

export interface EventMessage {
  eventName: string;
  eventData: number;
}

const HELLO_COMMAND_TYPE = "b8338344-bec9-4f7d-b8e2-b81a6d4591c7";
const TEST_COMMAND_TYPE = "59cb5357-80bb-4fa4-a15e-4797a535b50d";
const ERROR_COMMAND_TYPE = "30d5b015-4e8f-4f53-a1a0-b36decd71f4f";
const EVENT_COMMAND_TYPE = "33925dba-4acd-4b45-a40c-7bc97bfbe761";

export const useTestService = (): TestService => {
  const conn = usePproto();
  return new TestService(conn);
};

export class TestService {
  constructor(private readonly conn: PprotoConnection) {}

  async sendHello(): Promise<HelloAnswer> {
    return this.conn.sendCommand(HELLO_COMMAND_TYPE, null, 10);
  }

  async sendError(): Promise<void> {
    return this.conn.sendCommand(ERROR_COMMAND_TYPE, null);
  }

  async sendEvent(): Promise<void> {
    return this.conn.sendCommand(EVENT_COMMAND_TYPE, null);
  }

  onEvent(listener: (event: EventMessage) => void): PprotoSubscription {
    return this.conn.on(EVENT_COMMAND_TYPE, listener);
  }

  async sendTest(command: TestMessage): Promise<TestMessage> {
    return this.conn.sendCommand(TEST_COMMAND_TYPE, command);
  }
}
