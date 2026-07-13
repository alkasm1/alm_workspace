import { ServiceContainer }
  from "./ServiceContainer.js";

import { FileEventStore }
  from "../persistence/FileEventStore.js";

import { EventRepository }
  from "../persistence/EventRepository.js";

import { ReplayEngine }
  from "../persistence/ReplayEngine.js";

import { MiddlewareManager }
  from "../middleware/MiddlewareManager.js";

import { OpcodeRegistry }
  from "../request/OpcodeRegistry.js";

import { PendingRequests }
  from "../request/PendingRequests.js";

import { WebSocketTransport }
  from "../transports/WebSocketTransport.js";

import { RequestManager }
  from "../request/RequestManager.js";

import { DeviceManager }
  from "../device/DeviceManager.js";

import { TaskManager }
  from "../task/TaskManager.js";

import { EventPipeline }
  from "../events/EventPipeline.js";

import { EventNormalizer }
  from "../events/EventNormalizer.js";

export function createContainer(
  config = {}
) {
  const container =
    new ServiceContainer();

  // Persistence

  const eventStore =
    new FileEventStore();

  const eventRepository =
    new EventRepository(
      eventStore
    );

  const replayEngine =
    new ReplayEngine({
      repository:
        eventRepository
    });

  // Middleware

  const middleware =
    new MiddlewareManager();

  // Request Layer

  const registry =
    new OpcodeRegistry();

  const pending =
    new PendingRequests();

  const transport =
    new WebSocketTransport(
      config
    );

  const requestManager =
    new RequestManager({
      registry,
      transport,
      pending,
      middleware
    });

  // Events

  const eventPipeline =
    new EventPipeline();

  eventPipeline.use(
    (event) =>
      EventNormalizer.normalize(
        event
      )
  );

  // Register Services

  container.register(
    "eventStore",
    eventStore
  );

  container.register(
    "eventRepository",
    eventRepository
  );

  container.register(
    "replayEngine",
    replayEngine
  );

  container.register(
    "middleware",
    middleware
  );

  container.register(
    "registry",
    registry
  );

  container.register(
    "pending",
    pending
  );

  container.register(
    "transport",
    transport
  );

  container.register(
    "requestManager",
    requestManager
  );

  container.register(
    "eventPipeline",
    eventPipeline
  );

  return container;
}
