// app/types/user.ts (por ejemplo)
export type User = {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  cedula: string;
  categoriaId: number;
  disciplinaId: number;
  roles?: Role[];
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
  | "PDA"
  | "FINANCIERO"
  | "ENTRENADOR"; // Ejemplo de roles posibles
