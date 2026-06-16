export class Store {
  private listeners: Set<() => void> = new Set();
  private version = 0;

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  protected notify(): void {
    this.version += 1;
    this.listeners.forEach((listener) => listener());
  }

  getSnapshot(): number {
    return this.version;
  }
}
