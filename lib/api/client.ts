import type { ApiResponse } from "@/types/api-response";

export type ApiEnvelope<T> = ApiResponse<T>;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getApiUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) throw new Error("Falta NEXT_PUBLIC_API_URL");
  return url;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;

  if (!res.ok) {
    const msg = json?.message ?? `Error (${res.status})`;
    throw new ApiError(msg, res.status);
  }

  if (!json) throw new Error("Respuesta invalida del servidor");
  return json;
}
