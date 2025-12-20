/**
 * Organización/Federación deportiva
 */
export type Organizacion = {
  id: number;
  nombre: string;
  codigo: string;
  descripcion?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  logoUrl?: string;
  activa: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * Datos para crear una organización
 */
export type CreateOrganizacionInput = {
  nombre: string;
  codigo: string;
  descripcion?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
};

/**
 * Datos para actualizar una organización
 */
export type UpdateOrganizacionInput = Partial<CreateOrganizacionInput> & {
  activa?: boolean;
};

/**
 * Filtros para listar organizaciones
 */
export type OrganizacionFilters = {
  activa?: boolean;
  search?: string;
};
