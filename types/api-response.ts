export interface GlobalMeta {
  requestId: string;
  timestamp: string;
  apiVersion: string;
  durationMs: number;
  page?: number;
  limit?: number;
  total?: number;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
  meta?: GlobalMeta;
}
