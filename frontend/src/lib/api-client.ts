const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    token?: string
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(error.detail || JSON.stringify(error));
    }

    if (res.status === 204 || res.status === 205) {
      return {} as T;
    }

    return res.json();
  }

  get<T>(path: string, token?: string): Promise<T> {
    return this.request<T>("GET", path, undefined, token);
  }

  post<T>(path: string, body: unknown, token?: string): Promise<T> {
    return this.request<T>("POST", path, body, token);
  }

  patch<T>(path: string, body: unknown, token?: string): Promise<T> {
    return this.request<T>("PATCH", path, body, token);
  }

  delete<T>(path: string, token?: string): Promise<T> {
    return this.request<T>("DELETE", path, undefined, token);
  }

  /**
   * POST with SSE streaming response.
   * Reads `data: {...}` lines and invokes callbacks.
   */
  async streamPost(
    path: string,
    body: unknown,
    token: string | undefined,
    callbacks: {
      onChunk: (content: string) => void;
      onDone: () => void;
      onError?: (message: string) => void;
    },
  ): Promise<void> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Request failed" }));
      callbacks.onError?.(error.detail || "Request failed");
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === "chunk") {
            callbacks.onChunk(data.content);
          } else if (data.type === "done") {
            callbacks.onDone();
          } else if (data.type === "error") {
            callbacks.onError?.(data.content);
          }
        } catch {
          // skip malformed lines
        }
      }
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
