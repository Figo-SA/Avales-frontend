import { apiFetch } from "@/lib/api/client";
import type { Deportista, DeportistaListResponse } from "@/types/deportista";
import type { CreateDeportistaPayload } from "@/lib/validation/deportista";

export type ListDeportistasOptions = {
  sexo?: string;
  query?: string;
  page?: number;
  limit?: number;
};

export async function listDeportistas(options: ListDeportistasOptions = {}) {
  const params = new URLSearchParams();

  if (options.sexo) params.set("sexo", options.sexo);
  if (options.query) params.set("query", options.query);
  if (options.page) params.set("page", String(options.page));
  if (options.limit) params.set("limit", String(options.limit));

  const qs = params.toString();
  const url = qs ? `/deportistas?${qs}` : "/deportistas";

  return apiFetch<DeportistaListResponse>(url, { method: "GET" });
}

export async function createDeportista(values: CreateDeportistaPayload) {
  return apiFetch<Deportista>("/deportistas", {
    method: "POST",
    body: JSON.stringify(values),
  });
}
