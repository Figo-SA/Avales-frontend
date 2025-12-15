// app/types/user.ts (por ejemplo)
export type User = {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  cedula: string;
  roles: Role[]; // o string[] | undefined en tu definición actual
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
