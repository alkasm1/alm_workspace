import { EventEmitter } from "events";

// Core (INTERNAL STRUCTURE)
import { WebSocketTransport } from "../internal/transports/WebSocketTransport.js";
import { OpcodeRegistry } from "../internal/request/OpcodeRegistry.js";
import { RequestManager } from "../internal/request/RequestManager.js";
import { PendingRequests } from "../internal/request/PendingRequests.js";

// Events
import { EventPipeline } from "../internal/events/EventPipeline.js";
import { EventNormalizer } from "../internal/events/EventNormalizer.js";

// Persistence
import { FileEventStore } from "../internal/persistence/FileEventStore.js";
import { EventRepository } from "../internal/persistence/EventRepository.js";

// Middleware
import { MiddlewareManager } from "../internal/middleware/MiddlewareManager.js";

import { DeviceManager } from "../device/DeviceManager.js";
import { TaskManager } from "../internal/task/TaskManager.js";
import { SystemModule } from "../internal/modules/SystemModule.js";
import { TasksModule } from "../internal/modules/TasksModule.js";
import { Runtime } from "../runtime/Runtime.js";
import { RuntimeGuard } from "../runtime/index.js";

export class ALMClient {
  constructor(config = {}) {
    this.config = config;

    const runtime = config.runtime;

if (
  runtime &&
  typeof runtime.initialize === "function" &&
  typeof runtime.shutdown === "function"
) {
  this.runtimeGuard = runtime;
} else {
  this.runtimeGuard =
    new RuntimeGuard(runtime);
}
    
    // Event Bus
    this.events = new EventEmitter();

    // Modules
    this.modules = new Map();

    // Memory Control
    this.maxEvents = config.maxEvents ?? 500;
    this.eventTTL = config.eventTTL ?? 5 * 60 * 1000;
    this.cleanupInterval = null;

    this._resolveServices();
    this.runtime = new Runtime(this);
    this._ensureCriticalServices();
    this._bindTransport();

    this.registerModule(SystemModule);
    this.registerModule(TasksModule);

    this._startEventCleanup();
  }

  // =========================
  // SERVICES
  // =========================
  _resolveServices() {
    const c = this.config;

    this.transport = c.transport || this._createTransport(c);
    this.registry = c.registry || new OpcodeRegistry();
    this.pending = c.pending || new PendingRequests();
    this.middleware = c.middleware || new MiddlewareManager();

    this.eventPipeline =
      c.eventPipeline || new EventPipeline();

    this.eventPipeline.use((event) =>
      EventNormalizer.normalize(event)
    );

    this.eventRepository =
      c.eventRepository ||
      new EventRepository(
        new FileEventStore()
      );

    if (!this.eventRepository.store) {
      this.eventRepository.store = {
        events: []
      };
    }

    if (
      !Array.isArray(
        this.eventRepository.store.events
      )
    ) {
      this.eventRepository.store.events = [];
    }

    this.requestManager =
      c.requestManager ||
      new RequestManager({
        registry: this.registry,
        transport: this.transport,
        pending: this.pending,
        middleware: this.middleware
      });

    this.devices =
      c.devices ||
      new DeviceManager(this);

    this.taskManager =
      c.taskManager ||
      new TaskManager(this);
  }

  _createTransport(config) {
    if (!config.endpoint) {
      throw new Error(
        "[ALMClient] endpoint is required"
      );
    }

    return new WebSocketTransport(config);
  }

  _ensureCriticalServices() {
    if (!this.transport)
      throw new Error("transport missing");

    if (!this.requestManager)
      throw new Error("requestManager missing");

    if (!this.eventPipeline)
      throw new Error("eventPipeline missing");
  }

  _bindTransport() {
    this.transport.onMessage = (msg) =>
      this._handleIncoming(msg);

    this.transport.onConnected = () =>
      this.events.emit(
        "transport.connected"
      );

    this.transport.onDisconnected = () =>
      this.events.emit(
        "transport.disconnected"
      );

    this.transport.onReconnecting = (
      attempt
    ) =>
      this.events.emit(
        "transport.reconnecting",
        { attempt }
      );

    this.transport.onError = (err) =>
      this.events.emit(
        "transport.error",
        err
      );
  }

  // =========================
  // INCOMING EVENTS
  // =========================
  async _handleIncoming(message) {
    if (
      !message ||
      typeof message !== "object"
    ) {
      return;
    }

    if (message.requestId) {
      this.requestManager.handleResponse(
        message
      );
      return;
    }

    const processed =
      await this.eventPipeline.process(
        message
      );

    if (!processed) {
      return;
    }

    this._emitEvent(processed);
  }

  // =========================
// FIXED EVENT EMITTER (IMPORTANT)
// =========================
_emitEvent(event) {
  if (!event) return;

  const safeEvent = {
    ...event,
    timestamp: event.timestamp || Date.now()
  };

  try {
    this.eventRepository.save(safeEvent);
    this._getStore().push(safeEvent);
  } catch (_) {}

  // 🔥 مهم جدًا: تحديث الكاش
  this._updateCaches(safeEvent);

  this.events.emit(safeEvent.type, safeEvent);
}

// =========================
// CACHE SYNC
// =========================
_updateCaches(event) {
  if (!event?.type) return;

  switch (event.type) {
    case "device.event":
      this.devices.update(event);
      break;

    case "task.event":
      this.taskManager.update(event);
      break;
  }
}
  // =========================
  // PUBLIC API
  // =========================
  on(event, fn) {
    this.events.on(event, fn);
  }

  off(event, fn) {
    this.events.off(event, fn);
  }

  once(event, fn) {
    this.events.once(event, fn);
  }

  // =========================
  // LIFECYCLE
  // =========================
  
async connect() {
  await this.runtimeGuard.initialize();

  return this.transport.connect();
}
  async disconnect() {
    this._stopEventCleanup();

    await this.runtimeGuard.shutdown();
    return this.transport.disconnect();
  }

  // =========================
  // MODULE SYSTEM
  // =========================
  registerModule(ModuleClass) {
    const name = ModuleClass.moduleName;

    if (!name) {
      throw new Error(
        "moduleName required"
      );
    }

    if (this.modules.has(name)) {
      throw new Error(
        `Module exists: ${name}`
      );
    }

    if (
      typeof ModuleClass.registerOpcodes ===
      "function"
    ) {
      ModuleClass.registerOpcodes(
        this.registry
      );
    }

    const instance =
      new ModuleClass(this);

    this.modules.set(
      name,
      instance
    );

    this[name] = instance;

    return instance;
  }

  getModule(name) {
    return (
      this.modules.get(name) || null
    );
  }

  // =========================
  // SAFE STORE ACCESS
  // =========================
  _getStore() {
    if (!this.eventRepository?.store) {
      this.eventRepository.store = {
        events: []
      };
    }

    if (
      !Array.isArray(
        this.eventRepository.store.events
      )
    ) {
      this.eventRepository.store.events =
        [];
    }

    return this.eventRepository.store
      .events;
  }

  // =========================
  // EVENT API
  // =========================
  getEvents(filterFn = null) {
    const events =
      this.eventRepository.all?.() ||
      this._getStore();

    return typeof filterFn ===
      "function"
      ? events.filter(filterFn)
      : events;
  }

  getEventCount() {
    return this.getEvents().length;
  }

  getEventStats() {
    const events =
      this.getEvents();

    const stats = {
      total: events.length,
      byType: {}
    };

    for (const e of events) {
      const type =
        e?.type ??
        e?.event?.type ??
        "unknown";

      stats.byType[type] =
        (stats.byType[type] || 0) + 1;
    }

    return stats;
  }

  clearEvents() {
    this.eventRepository.store.events =
      [];

    if (
      typeof this.eventRepository
        .clear === "function"
    ) {
      this.eventRepository.clear();
    }
  }

  // =========================
  // CLEANUP ENGINE
  // =========================
  _startEventCleanup() {
    this.cleanupInterval =
      setInterval(() => {
        try {
          const events =
            this._getStore();

          const now = Date.now();

          let filtered =
            events.filter(
              (e) =>
                now -
                  (
                    e.timestamp ??
                    e.event
                      ?.timestamp ??
                    0
                  ) <
                this.eventTTL
            );

          if (
            filtered.length >
            this.maxEvents
          ) {
            filtered =
              filtered.slice(
                -this.maxEvents
              );
          }

          this.eventRepository.store.events =
            filtered;
        } catch (_) {}
      }, 30000);
  }

  _stopEventCleanup() {
    if (
      this.cleanupInterval
    ) {
      clearInterval(
        this.cleanupInterval
      );

      this.cleanupInterval =
        null;
    }
  }
}
