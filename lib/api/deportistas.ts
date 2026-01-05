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
  const url = qs ? `/athletes?${qs}` : "/athletes";

  return apiFetch<DeportistaListResponse>(url, { method: "GET" });
}

export async function createDeportista(values: CreateDeportistaPayload) {
  return apiFetch<Deportista>("/athletes", {
    method: "POST",
    body: JSON.stringify(values),
  });
}

export async function getDeportista(id: number) {
  return apiFetch<Deportista>(`/athletes/${id}`, { method: "GET" });
}

export type UpdateDeportistaPayload = Partial<CreateDeportistaPayload>;

export async function updateDeportista(
  id: number,
  values: UpdateDeportistaPayload
) {
  return apiFetch<Deportista>(`/athletes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(values),
  });
}

export async function softDeleteDeportista(id: number) {
  return apiFetch<void>(`/athletes/${id}`, { method: "DELETE" });
}

export async function restoreDeportista(id: number) {
  return apiFetch<Deportista>(`/athletes/${id}/recuperar`, {
    method: "POST",
  });
}

export async function hardDeleteDeportista(id: number) {
  return apiFetch<void>(`/athletes/${id}/definitivo`, {
    method: "DELETE",
  });
}
