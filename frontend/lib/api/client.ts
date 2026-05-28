export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new ApiError(res.status, text || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  return fetch(`${BASE_URL}${path}`, { cache: "no-store", ...init }).then(handle<T>);
}

export function apiJson<T>(method: "POST" | "PATCH" | "PUT", path: string, body: unknown): Promise<T> {
  return fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(handle<T>);
}

export function apiForm<T>(method: "POST" | "PATCH", path: string, form: FormData): Promise<T> {
  return fetch(`${BASE_URL}${path}`, { method, body: form }).then(handle<T>);
}

export function apiDelete(path: string): Promise<void> {
  return fetch(`${BASE_URL}${path}`, { method: "DELETE" }).then(handle<void>);
}
