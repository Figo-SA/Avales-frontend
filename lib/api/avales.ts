import { apiFetch } from "@/lib/api/client";
import type {
  Aval,
  AvalListResponse,
  CreateAvalPayload,
  Estado,
  EtapaFlujo,
  Historial,
} from "@/types/aval";

export type ListAvalesOptions = {
  page?: number;
  limit?: number;
  estado?: Estado;
  etapa?: EtapaFlujo;
  eventoId?: number;
  search?: string;
};

export async function listAvales(options: ListAvalesOptions = {}) {
  const params = new URLSearchParams();

  if (options.page) params.set("page", String(options.page));
  if (options.limit) params.set("limit", String(options.limit));
  if (options.estado) params.set("estado", options.estado);
  if (options.etapa) params.set("etapa", options.etapa);
  if (options.eventoId) params.set("eventoId", String(options.eventoId));
  if (options.search) params.set("search", options.search);

  const qs = params.toString();
  const url = qs ? `/avales?${qs}` : "/avales";

  return apiFetch<AvalListResponse>(url, { method: "GET" });
}

export async function getAval(id: number) {
  return apiFetch<Aval>(`/avales/${id}`, { method: "GET" });
}

export async function getAvalesByEvento(eventoId: number) {
  return apiFetch<Aval[]>(`/avales/evento/${eventoId}`, { method: "GET" });
}

export async function getAvalHistorial(id: number) {
  return apiFetch<Historial[]>(`/avales/${id}/historial`, { method: "GET" });
}

export async function createAval(payload: CreateAvalPayload, solicitud?: File) {
  const formData = new FormData();

  formData.append("eventoId", String(payload.eventoId));
  formData.append("fechaHoraSalida", payload.fechaHoraSalida);
  formData.append("fechaHoraRetorno", payload.fechaHoraRetorno);
  formData.append("transporteSalida", payload.transporteSalida);
  formData.append("transporteRetorno", payload.transporteRetorno);
  formData.append("objetivos", JSON.stringify(payload.objetivos));
  formData.append("criterios", JSON.stringify(payload.criterios));
  formData.append("rubros", JSON.stringify(payload.rubros));
  formData.append("deportistas", JSON.stringify(payload.deportistas));
  formData.append("entrenadores", JSON.stringify(payload.entrenadores));

  if (payload.observaciones) {
    formData.append("observaciones", payload.observaciones);
  }

  if (solicitud) {
    formData.append("solicitud", solicitud);
  }

  return apiFetch<Aval>("/avales", {
    method: "POST",
    body: formData,
    headers: {}, // Let browser set Content-Type with boundary
  });
}

export async function uploadAvalArchivo(id: number, archivo: File) {
  const formData = new FormData();
  formData.append("archivo", archivo);

  return apiFetch<Aval>(`/avales/${id}/archivo`, {
    method: "PATCH",
    body: formData,
    headers: {}, // Let browser set Content-Type with boundary
  });
}

export async function downloadDtmPdf(id: number) {
  return apiFetch<Blob>(`/avales/${id}/dtm-pdf`, {
    method: "GET",
    responseType: "blob",
  });
}

export async function downloadPdaPdf(id: number) {
  return apiFetch<Blob>(`/avales/${id}/pda-pdf`, {
    method: "GET",
    responseType: "blob",
  });
}

export async function aprobarAval(id: number, usuarioId: number) {
  return apiFetch<Aval>(`/avales/${id}/aprobar`, {
    method: "PATCH",
    body: JSON.stringify({ usuarioId }),
  });
}

export async function rechazarAval(
  id: number,
  usuarioId: number,
  motivo?: string
) {
  return apiFetch<Aval>(`/avales/${id}/rechazar`, {
    method: "PATCH",
    body: JSON.stringify({ usuarioId, motivo }),
  });
}
