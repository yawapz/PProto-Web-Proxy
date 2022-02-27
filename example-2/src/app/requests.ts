import { usePproto } from "../pproto/pproto-react";

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

export const useHelloRequest = () => {
  const conn = usePproto();
  return async (): Promise<HelloResponse> => {
    return await conn.request(HELLO_REQUEST_TYPE, null, 10);
  };
};

export const useTestRequest = () => {
  const conn = usePproto();
  return async (request: TestMessage): Promise<TestMessage> => {
    return await conn.request(TEST_REQUEST_TYPE, request);
  };
};
