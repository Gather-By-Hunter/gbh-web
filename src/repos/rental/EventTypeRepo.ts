import type { EventType } from "@model/index.ts";
import { ModelRepo } from "./ModelRepo.ts";
import type { HttpCommunicator } from "@api/HttpCommunicator.ts";

export class EventTypeRepo extends ModelRepo<EventType> {
  constructor(httpCommunicator: HttpCommunicator) {
    super(httpCommunicator, "rental/event-type");
  }
}
