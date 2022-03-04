import { usePprotoStatus } from "../pproto/pproto-react";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useTestService } from "./requests";

export const HomePage = () => {
  const status = usePprotoStatus();
  const test = useTestService();
  const [resp, setResp] = useState("");

  // Hello request

  const sendHello = async () => {
    setResp("Loading...");
    try {
      const r = await test.sendHello();
      setResp(JSON.stringify(r, null, 4));
    } catch (e) {
      setResp(`${e}`);
    }
  };

  // Error request

  const sendError = async () => {
    setResp("Loading...");
    try {
      await test.sendError();
    } catch (e) {
      setResp(`${e}`);
    }
  };

  // Event request

  const sendEvent = async () => {
    setResp("Loading...");
    try {
      await test.sendEvent();
    } catch (e) {
      setResp(`${e}`);
    }
  };

  useEffect(() => {
    const sub = test.onEvent((e) => {
      setResp(JSON.stringify(e));
    });
    return () => sub.unsubscribe();
  });

  // -------------

  return (
    <Root>
      <Status>
        Статус: {status === "connected" ? "Подключено" : "Отключено"}
      </Status>
      <RequestButton onClick={sendHello}>Hello request</RequestButton>
      <RequestButton onClick={sendError}>Error request</RequestButton>
      <RequestButton onClick={sendEvent}>Event request</RequestButton>
      <label>
        Ответ от сервера
        <ResultTextArea readOnly value={resp} />
      </label>
    </Root>
  );
};

const Root = styled.div`
  padding: 8px;
`;

const Status = styled.div`
  margin-bottom: 16px;
`;

const RequestButton = styled.button`
  display: block;
  margin-bottom: 8px;
`;

const ResultTextArea = styled.textarea`
  display: block;
  resize: none;
  width: 600px;
  height: 400px;
  max-width: 100%;
`;
