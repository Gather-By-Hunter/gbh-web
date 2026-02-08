import { GbhContext } from "@context/Context.ts";

export class ServerService<R = undefined> {
  constructor(
    protected context: GbhContext,
    protected repo: R,
  ) {}
}
