import type { ApiResponse } from "@/types/api-response";
import type { ProblemDetails } from "@/types/problem-details";

export type ApiEnvelope<T> = ApiResponse<T>;

export class ApiError extends Error {
  status: number;
  problem?: ProblemDetails | null;
  constructor(
    message: string,
    status: number,
    problem?: ProblemDetails | null
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.problem = problem;
  }
}

function getApiUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) throw new Error("Falta NEXT_PUBLIC_API_URL");
  return url;
}

function isProblemDetails(value: unknown): value is ProblemDetails {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as ProblemDetails).type === "string" &&
    (typeof (value as ProblemDetails).title === "string" ||
      typeof (value as ProblemDetails).status === "number")
  );
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const payload = value as ApiResponse<unknown>;
  return payload.status === "success" || payload.status === "error";
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Si el body es FormData, no establecer Content-Type para que el browser lo haga automáticamente
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    credentials: "include",
    headers: isFormData
      ? {
          ...(options.headers ?? {}),
        }
      : {
          "Content-Type": "application/json",
          ...(options.headers ?? {}),
        },
  });
  const payload = (await res.json().catch(() => null)) as
    | ApiResponse<T>
    | ProblemDetails
    | null;

  if (!res.ok) {
    const problem = isProblemDetails(payload) ? payload : null;
    const fallbackMessage =
      (payload && typeof payload === "object"
        ? "message" in payload
          ? (payload as { message?: string }).message
          : undefined
        : undefined) ?? `Error (${res.status})`;
    const msg = problem?.detail ?? problem?.title ?? fallbackMessage;
    throw new ApiError(msg, res.status, problem);
  }

  if (!payload || !isApiResponse(payload)) {
    throw new Error("Respuesta invalida del servidor");
  }

  return payload;
}
