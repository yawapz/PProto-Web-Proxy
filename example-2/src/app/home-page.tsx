import { usePproto, usePprotoStatus } from "../pproto/pproto-react";
import styled from "styled-components";
import { useState } from "react";
import { useHelloRequest } from "./requests";
import { PprotoError } from "../pproto/pproto";

export const HomePage = () => {
  const status = usePprotoStatus();
  const hello = useHelloRequest();
  const [resp, setResp] = useState("");

  const sendRequest = async () => {
    setResp("Loading...");
    try {
      const r = await hello();
      setResp(JSON.stringify(r, null, 4));
    } catch (e) {
      setResp(`${e}`);
    }
  };

  return (
    <Root>
      <Status>
        Статус: {status === "connected" ? "Подключено" : "Отключено"}
      </Status>
      <RequestButton onClick={sendRequest}>Отправить запрос</RequestButton>
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
