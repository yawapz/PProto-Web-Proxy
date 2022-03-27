import styled from "styled-components";
import { useRef, useState } from "react";
import { useTestService } from "./commands";

const NUM_IMAGES = 3;

export const ImagePage = () => {
  const test = useTestService();
  const index = useRef(-1);
  const [data, setData] = useState("");

  const sendHello = async () => {
    setData("");
    try {
      index.current = (index.current + 1) % NUM_IMAGES;
      const r = await test.sendImageBase64({
        index: index.current,
      });
      setData(`data:image/png;base64,${r.data}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Root>
      <CommandButton onClick={sendHello}>Get image</CommandButton>
      {data ? <Image src={data} /> : null}
    </Root>
  );
};

const Root = styled.div`
  padding: 8px;
`;

const CommandButton = styled.button`
  display: block;
  margin-bottom: 8px;
`;

const Image = styled.img`
  width: 400px;
  height: 400px;
  object-fit: contain;
  object-position: center;
`;
