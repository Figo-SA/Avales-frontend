// app/types/user.ts (por ejemplo)
export type User = {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  cedula: string;
  roles: string[]; // o string[] | undefined en tu definición actual
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
};
