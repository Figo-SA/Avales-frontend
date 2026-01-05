import { apiFetch } from "@/lib/api/client";
import type { Deportista, DeportistaListResponse } from "@/types/deportista";
import type { CreateDeportistaPayload } from "@/lib/validation/deportista";

export type ListDeportistasOptions = {
  genero?: string;
  query?: string;
  page?: number;
  limit?: number;
  soloAfiliados?: boolean;
};

export async function listDeportistas(options: ListDeportistasOptions = {}) {
  const params = new URLSearchParams();

  if (options.genero) params.set("genero", options.genero);
  if (options.query) params.set("query", options.query);
  if (options.page) params.set("page", String(options.page));
  if (options.limit) params.set("limit", String(options.limit));
  if (options.soloAfiliados !== undefined)
    params.set("soloAfiliados", String(options.soloAfiliados));

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
  return apiFetch<Deportista>(`/athletes/${id}/restore`, {
    method: "POST",
  });
}

export async function hardDeleteDeportista(id: number) {
  return apiFetch<void>(`/athletes/${id}/permanent`, {
    method: "DELETE",
  });
}

export async function getDeportistaByCedula(cedula: string) {
  return apiFetch<Deportista>(`/athletes/search/cedula?cedula=${encodeURIComponent(cedula)}`, {
    method: "GET",
  });
}
