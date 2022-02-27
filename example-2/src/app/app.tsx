import { AppRoutes } from "./app-routes";
import { PprotoProvider } from "../pproto/pproto-react";

function App() {
  return (
    <PprotoProvider url={"ws://localhost:9000"}>
      <AppRoutes />
    </PprotoProvider>
  );
}

export default App;
