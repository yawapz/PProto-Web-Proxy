import { usePprotoStatus } from "../pproto/pproto-react";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useTestService } from "./commands";

export const HomePage = () => {
  const status = usePprotoStatus();
  const test = useTestService();
  const [answer, setAnswer] = useState("");

  // Hello command

  const sendHello = async () => {
    setAnswer("Loading...");
    try {
      const r = await test.sendHello();
      setAnswer(JSON.stringify(r, null, 4));
    } catch (e) {
      setAnswer(`${e}`);
    }
  };

  // Error command

  const sendError = async () => {
    setAnswer("Loading...");
    try {
      await test.sendError();
    } catch (e) {
      setAnswer(`${e}`);
    }
  };

  // Event command

  const sendEvent = async () => {
    setAnswer("Loading...");
    try {
      await test.sendEvent();
    } catch (e) {
      setAnswer(JSON.stringify(e, null, 4));
    }
  };

  useEffect(() => {
    const sub = test.onEvent((e) => {
      setAnswer(JSON.stringify(e, null, 4));
    });
    return () => sub.unsubscribe();
  });

  // -------------

  return (
    <Root>
      <Status>
        Статус: {status === "connected" ? "Подключено" : "Отключено"}
      </Status>
      <CommandButton onClick={sendHello}>Send hello</CommandButton>
      <CommandButton onClick={sendError}>Send error</CommandButton>
      <CommandButton onClick={sendEvent}>Send event</CommandButton>
      <label>
        Ответ от сервера
        <ResultTextArea readOnly value={answer} />
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

const CommandButton = styled.button`
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
