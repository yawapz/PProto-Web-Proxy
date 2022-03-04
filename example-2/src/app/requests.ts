import { usePproto } from "../pproto/pproto-react";
import { PprotoConnection } from "../pproto/pproto";

export interface HelloResponse {
  value: string;
}

export interface TestMessage {
  uuid: string;
  beginTest: boolean;
  endTest: boolean;
}

const HELLO_REQUEST_TYPE = "b8338344-bec9-4f7d-b8e2-b81a6d4591c7";
const TEST_REQUEST_TYPE = "59cb5357-80bb-4fa4-a15e-4797a535b50d";

export const useTestService = (): TestService => {
  const conn = usePproto();
  return new TestService(conn);
};

export class TestService {
  constructor(private readonly conn: PprotoConnection) {}

  async sendHello(): Promise<HelloResponse> {
    return this.conn.request(HELLO_REQUEST_TYPE, null, 10);
  }

  async sendTest(request: TestMessage): Promise<TestMessage> {
    return this.conn.request(TEST_REQUEST_TYPE, request);
  }
}
