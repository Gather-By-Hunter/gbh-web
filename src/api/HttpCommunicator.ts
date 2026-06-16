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

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "Request failed";
};

export class HttpCommunicator {
  /**
   * @param baseUrl The base API URL, expected to be formatted WITHOUT a trailing slash.
   */
  constructor(private baseUrl: string) {}

  // Should be called if the communicator is ever disposed,
  // though it typically lives for the app lifecycle.
  public dispose() {}

  private async apiCall<T, B = unknown>(
    method: "POST" | "PUT" | "DELETE" | "GET" | "PATCH",
    endpoint: string,
    req?: B,
    headers?: Record<string, string>,
  ): Promise<T | void> {
    headers = {
      ...headers,
      ...(req ? { "Content-type": "application/json" } : {}),
    };

    const url = this.getUrl(endpoint);

    const params = this.getParams(
      method,
      headers,
      req ? JSON.stringify(req) : undefined,
    );

    try {
      const resp: Response = await fetch(url, params);

      if (resp.ok) {
        if (resp.headers.get("content-type")?.includes("application/json")) {
          return (await resp.json()) as T;
        }

        return;
      } else {
        const errorMessage = await resp.text();

        const type = resp.statusText as HttpErrorType;

        throw new HttpError(errorMessage, type);
      }
    } catch (error) {
      if (error instanceof HttpError) throw error;

      throw new HttpError(getErrorMessage(error), HttpErrorType.REQUEST);
    }
  }

  public async get<T>(
    endpoint: string,
    headers?: Record<string, string>,
  ): Promise<T> {
    const response = await this.apiCall<T>("GET", endpoint, undefined, headers);
    if (response === undefined) {
      throw new HttpError("Expected JSON response", HttpErrorType.UNKNOWN);
    }
    return response;
  }

  public async post<B = unknown>(
    endpoint: string,
    req?: B,
    headers?: Record<string, string>,
  ): Promise<void>;
  public async post<T, B = unknown>(
    endpoint: string,
    req?: B,
    headers?: Record<string, string>,
  ): Promise<T>;
  public async post<T, B = unknown>(
    endpoint: string,
    req?: B,
    headers?: Record<string, string>,
  ): Promise<T | void> {
    return this.apiCall<T, B>("POST", endpoint, req, headers);
  }

  public async put<B = unknown>(
    endpoint: string,
    req?: B,
    headers?: Record<string, string>,
  ): Promise<void>;
  public async put<T, B = unknown>(
    endpoint: string,
    req?: B,
    headers?: Record<string, string>,
  ): Promise<T>;
  public async put<T, B = unknown>(
    endpoint: string,
    req?: B,
    headers?: Record<string, string>,
  ): Promise<T | void> {
    return this.apiCall<T, B>("PUT", endpoint, req, headers);
  }

  public async patch<B = unknown>(
    endpoint: string,
    req?: B,
    headers?: Record<string, string>,
  ): Promise<void>;
  public async patch<T, B = unknown>(
    endpoint: string,
    req?: B,
    headers?: Record<string, string>,
  ): Promise<T>;
  public async patch<T, B = unknown>(
    endpoint: string,
    req?: B,
    headers?: Record<string, string>,
  ): Promise<T | void> {
    return this.apiCall<T, B>("PATCH", endpoint, req, headers);
  }

  public async delete(
    endpoint: string,
    headers?: Record<string, string>,
  ): Promise<void>;
  public async delete<T>(
    endpoint: string,
    headers?: Record<string, string>,
  ): Promise<T>;
  public async delete<T>(
    endpoint: string,
    headers?: Record<string, string>,
  ): Promise<T | void> {
    return this.apiCall<T>("DELETE", endpoint, undefined, headers);
  }

  private getUrl(endpoint: string): string {
    // baseUrl is guaranteed to NOT have a trailing slash.
    // Ensure endpoint starts with a slash.
    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;
    return this.baseUrl + normalizedEndpoint;
  }

  private getParams(
    method: string,
    headers?: Record<string, string>,
    body?: BodyInit,
  ): RequestInit {
    const params: RequestInit = { method: method, credentials: "include" };

    if (headers) {
      params.headers = headers;
    }

    if (body) {
      params.body = body;
    }

    return params;
  }
}
