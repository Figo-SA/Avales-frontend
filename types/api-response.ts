// app/types/api-response.ts
export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
  meta?: unknown;
}
