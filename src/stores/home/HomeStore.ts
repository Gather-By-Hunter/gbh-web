import {
  HomeMediaDisplay,
  MediaVersion,
} from "@model/index.ts";
import { Store } from "../Store.ts";

export class HomeStore extends Store {
  private _featuredPhotos: HomeMediaDisplay[] = [];
  private _mediaVersions: Record<number, MediaVersion[]> = {};
  private _loading: boolean = false;

  constructor() {
    super();
  }

  get featuredPhotos() {
    return this._featuredPhotos;
  }

  get mediaVersions() {
    return this._mediaVersions;
  }

  get loading() {
    return this._loading;
  }

  setLoading(loading: boolean): void {
    this._loading = loading;
    this.notify();
  }

  setFeaturedPhotos(
    photos: HomeMediaDisplay[],
    versions: Record<number, MediaVersion[]>,
  ): void {
    this._featuredPhotos = photos;
    this._mediaVersions = versions;
    this._loading = false;
    this.notify();
  }

  clearFeaturedPhotos(): void {
    this._featuredPhotos = [];
    this._mediaVersions = {};
    this._loading = false;
    this.notify();
  }
}
