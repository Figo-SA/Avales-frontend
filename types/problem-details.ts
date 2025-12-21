export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  requestId?: string; // extensiones útiles
  apiVersion?: string; // extensiones útiles
  durationMs?: number;
  field?: string;
  errorCode?: string;
  message?: string;
  [key: string]: unknown;
}
