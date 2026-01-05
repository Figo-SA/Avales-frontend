import { apiFetch } from "@/lib/api/client";
import type { Aval, AvalListResponse, CreateAvalPayload } from "@/types/aval";

export type ListAvalesOptions = {
  page?: number;
  limit?: number;
  estado?: string;
  search?: string;
};

export async function listAvales(options: ListAvalesOptions = {}) {
  const params = new URLSearchParams();

  if (options.page) params.set("page", String(options.page));
  if (options.limit) params.set("limit", String(options.limit));
  if (options.estado) params.set("estado", options.estado);
  if (options.search) params.set("search", options.search);

  const qs = params.toString();
  const url = qs ? `/avales?${qs}` : "/avales";

  return apiFetch<AvalListResponse>(url, { method: "GET" });
}

export async function getAval(id: number) {
  return apiFetch<Aval>(`/avales/${id}`, { method: "GET" });
}

export async function createAval(payload: CreateAvalPayload) {
  return apiFetch<Aval>("/avales", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function cancelAval(id: number) {
  return apiFetch<{ id: number }>(`/avales/${id}/cancelar`, { method: "POST" });
}
