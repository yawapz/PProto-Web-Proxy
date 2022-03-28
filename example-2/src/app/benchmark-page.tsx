import { TestMessage, useTestService } from "./commands";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import styled from "styled-components";

export const BenchmarkPage = () => {
  const test = useTestService();
  const [result, setResult] = useState("");

  const run = async () => {
    setResult("Benchmarking...");

    const t1 = performance.now();
    const batchSize = 1000;
    const testTime = 10000;
    let counter = 0;

    await test.sendTest({
      beginTest: true,
      endTest: false,
      uuid: uuid(),
    });

    while (performance.now() < t1 + testTime) {
      const answers: Array<Promise<TestMessage>> = [];

      for (let i = 0; i < batchSize; ++i) {
        answers.push(
          test.sendTest({
            beginTest: false,
            endTest: false,
            uuid: uuid(),
          })
        );
      }

      await Promise.all(answers);
      counter += batchSize;
    }

    await test.sendTest({
      beginTest: false,
      endTest: true,
      uuid: uuid(),
    });

    const t2 = performance.now();
    const rps = Math.round((counter / (t2 - t1)) * 1000);
    setResult(`${rps} requests/second`);
  };

  return (
    <Root>
      <button onClick={run}>Benchmark</button>
      <div>{result}</div>
    </Root>
  );
};

const Root = styled.div`
  padding: 8px;
`;
