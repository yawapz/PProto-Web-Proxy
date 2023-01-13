import { PprotoConnection, PprotoStatus } from "./pproto";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

const PprotoContext = createContext<PprotoConnection | null>(null);

export const usePproto = (): PprotoConnection => {
  const conn = useContext(PprotoContext);
  if (!conn) throw new Error("PprotoConnection is not provided");
  return conn;
};

export const PprotoProvider = (props: PropsWithChildren<{ url: string }>) => {
  const [conn, setConn] = useState<PprotoConnection | null>(null);

  useEffect(() => {
    const c = new PprotoConnection(props.url);
    setConn(c);
    return () => c.close();
  }, [props.url]);

  return conn ? (
    <PprotoContext.Provider value={conn}>
      {props.children}
    </PprotoContext.Provider>
  ) : null;
};

export const usePprotoStatus = (): PprotoStatus => {
  const pproto = usePproto();
  const [status, setStatus] = useState<PprotoStatus>(pproto.status);

  useEffect(() => {
    const subs = [
      pproto.onEvent("connected", () => setStatus("connected")),
      pproto.onEvent("disconnected", () => setStatus("disconnected")),
    ];
    return () => {
      subs.forEach((s) => s.unsubscribe());
    };
  }, [pproto]);

  return status;
};
