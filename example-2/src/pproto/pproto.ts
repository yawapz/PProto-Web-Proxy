import ReconnectingWebSocket from "reconnecting-websocket";
import { v4 as uuid } from "uuid";

export type PprotoStatus = "connected" | "disconnected";

export class PprotoError extends Error {
  constructor(
    public readonly group: number,
    public readonly code: string,
    public readonly description: string
  ) {
    super(
      `PprotoError(group: ${group}, code: ${code}, description: ${description})`
    );
  }
}

export class TimeoutError extends Error {
  constructor() {
    super("TimeoutError");
  }
}

export type PprotoListener<T> = (data: T) => void;

export interface PprotoSubscription {
  unsubscribe(): void;
}

export class PprotoConnection {
  private readonly ws: ReconnectingWebSocket;
  private readonly requests: Record<string, Resolvable<any>> = {};
  private readonly listeners: Record<string, Set<PprotoListener<any>>> = {};

  private _status: PprotoStatus = "disconnected";
  get status() {
    return this._status;
  }

  constructor(private readonly url: string) {
    this.ws = new ReconnectingWebSocket(url);
    this.ws.onmessage = (e) => this.onMessage(e);

    this.ws.onopen = () => {
      this._status = "connected";
      this.notifyListeners("connected", this);
    };

    this.ws.onclose = () => {
      this._status = "disconnected";
      this.notifyListeners("disconnected", this);
    };
  }

  async request<T, R>(
    command: string,
    content: T,
    timeout?: number
  ): Promise<R> {
    return new Promise((resolve, reject) => {
      const maxTimeLife =
        timeout !== undefined
          ? Math.round(new Date().getTime() / 1000 + timeout)
          : undefined;

      const request: ProtocolMessage = {
        id: uuid(),
        command,
        content,
        webFlags: {
          type: "command",
          execStatus: "unknown",
          priority: "normal",
          contentFormat: "json",
        },
        maxTimeLife,
        tags: [],
      };
      this.ws.send(JSON.stringify(request));
      this.requests[request.id] = { resolve, reject };

      if (timeout !== undefined) {
        setTimeout(() => {
          reject(new TimeoutError());
          delete this.requests[request.id];
        }, timeout * 1000);
      }
    });
  }

  on(
    type: "connected" | "disconnected",
    listener: PprotoListener<PprotoConnection>
  ): PprotoSubscription;

  on<T>(type: string, listener: PprotoListener<T>): PprotoSubscription;

  on(type: string, listener: PprotoListener<any>): PprotoSubscription {
    let listeners = this.listeners[type];
    if (!listeners) {
      listeners = new Set();
      this.listeners[type] = listeners;
    }
    listeners.add(listener);

    return {
      unsubscribe: () => listeners?.delete(listener),
    };
  }

  close() {
    return this.ws.close();
  }

  private onMessage(event: MessageEvent) {
    const message: ProtocolMessage = JSON.parse(event.data);

    switch (message.webFlags.type) {
      case "answer": {
        const request = this.requests[message.id];
        delete this.requests[message.id];

        switch (message.webFlags.execStatus) {
          case "success": {
            request?.resolve(message.content);
            break;
          }

          case "error":
          case "failed": {
            const error: ErrorContent = message.content;
            request?.reject(
              new PprotoError(error.group, error.code, error.description)
            );
          }
        }
        break;
      }

      case "event": {
        this.notifyListeners(message.command, message.content);
        break;
      }
    }
  }

  private notifyListeners(type: string, data: any) {
    const listeners = this.listeners[type];
    if (listeners) {
      for (const listener of listeners) {
        listener(data);
      }
    }
  }
}

export interface ProtocolMessage {
  id: string;
  command: string;
  content: any;
  webFlags: {
    type: "command" | "answer" | "event";
    execStatus: "unknown" | "success" | "failed" | "error";
    priority: "normal";
    contentFormat: "json";
  };
  maxTimeLife?: number;
  tags: number[];
}

export interface ErrorContent {
  group: number;
  code: string;
  description: string;
}

interface Resolvable<T> {
  resolve(data: T): void;
  reject(error: Error): void;
}
