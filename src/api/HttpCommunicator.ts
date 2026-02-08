import { PersistanceStore } from "@stores/PersistanceStore.ts";

enum HttpErrorType {
  BAD_REQUEST = "Bad Request",
  UNAUTHORIZED = "Unauthorized",
  SERVER = "ServerError",
  REQUEST = "RequestError",
  UNKNOWN = "UNKNOWN",
}

export class HttpError extends Error {
  public readonly errorType: HttpErrorType;

  constructor(message: string, errorType: HttpErrorType) {
    super(message);
    this.errorType = errorType;
  }
}

export class HttpCommunicator {
  private authToken: string | null;
  private authTokenSubscriptionId: string;

  constructor(
    private baseUrl: string,
    private persistanceStore: PersistanceStore,
  ) {
    this.authTokenSubscriptionId = this.persistanceStore.subscribeToAuthToken(
      (authToken) => {
        this.authToken = authToken;
      },
    );

    this.authToken = this.persistanceStore.getAuthToken();
  }

  private async apiCall<T>(
    method: "POST" | "PUT" | "DELETE" | "GET" | "PATCH",
    endpoint: string,
    req: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    if (headers && req) {
      headers = {
        "Content-type": "application/json",
        ...headers,
      };
    } else if (req) {
      headers = {
        "Content-type": "application/json",
      };
    } else if (!headers) {
      headers = {};
    }

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    const url = this.getUrl(endpoint);

    const params = this.getParams(
      method,
      headers,
      // @ts-ignore
      req ? JSON.stringify(req) : req,
    );

    try {
      const resp: Response = await fetch(url, params);

      if (resp.ok) {
        let response: T = undefined as T;

        if (resp.headers.get("content-type")?.includes("application/json")) {
          response = (await resp.json()) as T;
        }

        return response;
      } else {
        const errorMessage = await resp.text();

        const type = resp.statusText as HttpErrorType;

        throw new HttpError(errorMessage, type);
      }
    } catch (error) {
      if (error instanceof HttpError) throw error;

      throw new HttpError((error as Error).message, HttpErrorType.REQUEST);
    }
  }

  public async get<T>(
    endpoint: string,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.apiCall<T>("GET", endpoint, undefined, headers);
  }

  public async post<T>(
    endpoint: string,
    req?: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.apiCall<T>("POST", endpoint, req, headers);
  }

  public async put<T>(
    endpoint: string,
    req?: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.apiCall<T>("PUT", endpoint, req, headers);
  }

  public async patch<T>(
    endpoint: string,
    req?: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.apiCall<T>("PATCH", endpoint, req, headers);
  }

  public async delete<T>(
    endpoint: string,
    req?: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.apiCall<T>("DELETE", endpoint, req, headers);
  }

  private getUrl(endpoint: string): string {
    return this.baseUrl + endpoint;
  }

  private getParams(
    method: string,
    headers?: Record<string, string>,
    body?: BodyInit,
  ): RequestInit {
    const params: RequestInit = { method: method };

    if (headers) {
      params.headers = headers;
    }

    if (body) {
      params.body = body;
    }

    return params;
  }
}
