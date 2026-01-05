import type { Evento } from "@/types/evento";
import type { User } from "@/types/user";

export type AvalEstado = "PENDIENTE" | "APROBADO" | "RECHAZADO";

export type Aval = {
  id: number;
  codigo: string;
  estado: AvalEstado;
  observaciones?: string | null;
  fechaSolicitud: string;
  fechaRespuesta?: string | null;
  evento: Evento;
  eventoId: number;
  solicitante: User;
  solicitanteId: number;
  aprobadoPor?: User | null;
  aprobadoPorId?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AvalListResponse = Aval[];

export type CreateAvalPayload = {
  eventoId: number;
  observaciones?: string;
};
