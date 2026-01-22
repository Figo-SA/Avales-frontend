import type { CatalogItem } from "@/types/catalog";

export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "SECRETARIA"
  | "DTM"
  | "METODOLOGO"
  | "ENTRENADOR"
  | "USUARIO"
  | "DEPORTISTA"
  | "PDA"
  | "CONTROL_PREVIO"
  | "FINANCIERO";

export type Genero = "MASCULINO" | "FEMENINO" | "MASCULINO_FEMENINO";

export type User = {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  cedula: string;
  genero?: Genero;
  categoria?: CatalogItem;
  categoriaId?: number;
  disciplina?: CatalogItem;
  disciplinaId?: number;
  roles?: Role[];
  rolId?: number;
  disciplinas?: number[];
  categorias?: number[];
  pushToken?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UserListResponse = User[];

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
};
