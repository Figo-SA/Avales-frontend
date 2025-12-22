import type { CatalogItem } from "@/types/catalog";

// app/types/user.ts (por ejemplo)
export type User = {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  cedula: string;
  categoria?: CatalogItem;
  disciplina?: CatalogItem;
  rolIds?: number[];
  roles?: Role[];
  pushToken?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
};

export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "SECRETARIA"
  | "DTM"
  | "DTM_EIDE"
  | "USUARIO"
  | "DEPORTISTA"
  | "PDA"
  | "FINANCIERO"
  | "ENTRENADOR";
export type UserListResponse = User[];
