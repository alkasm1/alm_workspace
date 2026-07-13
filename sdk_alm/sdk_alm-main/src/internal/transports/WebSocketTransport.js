// src/internal/transports/WebSocketTransport.js

import WebSocket from "ws";
import { BaseTransport } from "./BaseTransport.js";

export class WebSocketTransport extends BaseTransport {
  constructor(config = {}) {
    super();

    this.config = config;

    this.ws = null;
    this.onMessage = null;

    // transport events
    this.onConnected = null;
    this.onDisconnected = null;
    this.onReconnecting = null;
    this.onError = null;

    // state machine
    this.state = "DISCONNECTED";

    // reconnect
    this.reconnectAttempts = 0;

    this.maxReconnectAttempts =
      config.maxReconnectAttempts ?? 10;

    this.reconnectDelay =
      config.reconnectDelay ?? 1000;

    this.reconnectTimer = null;

    // heartbeat
    this.heartbeatTimer = null;

    this.heartbeatInterval =
      config.heartbeatInterval ?? 30000;

    // distinguish manual close
    this.manualDisconnect = false;
  }

  get connected() {
    return this.state === "CONNECTED";
  }

  async connect() {
    if (
      this.state === "CONNECTED" ||
      this.state === "CONNECTING"
    ) {
      return;
    }

    const url = this.config.endpoint;

    if (!url) {
      throw new Error(
        "WebSocket endpoint is required"
      );
    }

    this.manualDisconnect = false;
    this.state = "CONNECTING";

    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.state = "CONNECTED";

        this.reconnectAttempts = 0;

        this._startHeartbeat();

        if (this.onConnected) {
          this.onConnected();
        }

        resolve();
      };

      this.ws.onerror = (error) => {
        if (this.onError) {
          this.onError(error);
        }

        reject(error);
      };

      this.ws.onclose = () => {
        this.state = "DISCONNECTED";

        this._stopHeartbeat();

        if (this.onDisconnected) {
          this.onDisconnected();
        }

        if (!this.manualDisconnect) {
          this._handleReconnect();
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message =
            JSON.parse(event.data);

          if (this.onMessage) {
            this.onMessage(message);
          }
        } catch (error) {
          console.error(
            "Failed to parse WebSocket message",
            error
          );
        }
      };
    });
  }

  async disconnect() {
    this.manualDisconnect = true;

    this.state = "DISCONNECTED";

    this._stopHeartbeat();

    if (this.reconnectTimer) {
      clearTimeout(
        this.reconnectTimer
      );

      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  async send(request) {
    if (!this.connected) {
      throw new Error(
        "Transport is not connected"
      );
    }

    try {
      this.ws.send(
        JSON.stringify(request)
      );
    } catch (error) {
      throw error;
    }
  }

  _handleReconnect() {
    if (
      this.reconnectAttempts >=
      this.maxReconnectAttempts
    ) {
      return;
    }

    this.state = "RECONNECTING";

    if (this.onReconnecting) {
      this.onReconnecting(
        this.reconnectAttempts + 1
      );
    }

    const delay = Math.min(
      this.reconnectDelay *
        2 ** this.reconnectAttempts,
      30000
    );

    this.reconnectAttempts++;

    this.reconnectTimer =
      setTimeout(() => {
        this.connect().catch(() => {
          this._handleReconnect();
        });
      }, delay);
  }

  _startHeartbeat() {
    this._stopHeartbeat();

    this.heartbeatTimer =
      setInterval(() => {
        if (!this.connected) {
          return;
        }

        try {
          this.ws?.ping?.();
        } catch {
          // ignore
        }
      }, this.heartbeatInterval);
  }

  _stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(
        this.heartbeatTimer
      );

      this.heartbeatTimer = null;
    }
  }
}
