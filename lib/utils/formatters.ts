/**
 * Funciones de formato centralizadas para uso en tablas y componentes.
 * Todas las funciones manejan valores null/undefined devolviendo "-".
 */

/**
 * Formatea una fecha ISO a formato local legible.
 * @param value - Fecha en formato ISO string o null/undefined
 * @returns Fecha formateada o "-" si no es válida
 */
export function formatDate(value?: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

/**
 * Formatea una fecha ISO incluyendo hora.
 * @param value - Fecha en formato ISO string o null/undefined
 * @returns Fecha y hora formateadas o "-" si no es válida
 */
export function formatDateTime(value?: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

/**
 * Mapa de géneros para mostrar en UI.
 */
const GENERO_MAP: Record<string, string> = {
  M: "Masculino",
  MASCULINO: "Masculino",
  F: "Femenino",
  FEMENINO: "Femenino",
  O: "Otro",
  OTRO: "Otro",
};

/**
 * Formatea el género a texto legible.
 * @param genero - Código o nombre del género
 * @returns Género formateado o "-" si no existe
 */
export function formatGenero(genero?: string | null): string {
  if (!genero) return "-";
  return GENERO_MAP[genero.toUpperCase()] ?? genero;
}

/**
 * Formatea un booleano a texto personalizado.
 * @param value - Valor booleano o null/undefined
 * @param labels - Objeto con etiquetas { true: "Sí", false: "No" }
 * @returns Texto correspondiente o "-" si es null/undefined
 */
export function formatBoolean(
  value?: boolean | null,
  labels: { true: string; false: string } = { true: "Sí", false: "No" }
): string {
  if (value === null || value === undefined) return "-";
  return value ? labels.true : labels.false;
}

/**
 * Formatea un enum usando un mapa de valores.
 * @param value - Valor del enum
 * @param map - Mapa de valores a etiquetas
 * @returns Etiqueta correspondiente o el valor original
 */
export function formatEnum<T extends string>(
  value: T | null | undefined,
  map: Record<T, string>
): string {
  if (!value) return "-";
  return map[value] ?? value;
}

/**
 * Formatea un rol de usuario a texto legible.
 * Convierte SUPER_ADMIN -> "Super Admin", DTM_EIDE -> "Dtm Eide"
 * @param role - Código del rol
 * @returns Rol formateado
 */
export function formatRole(role?: string | null): string {
  if (!role) return "-";
  return role
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/**
 * Formatea un array de roles a texto.
 * @param roles - Array de roles
 * @returns Roles separados por coma o "-" si está vacío
 */
export function formatRoles(roles?: string[] | null): string {
  if (!roles || roles.length === 0) return "-";
  return roles.map(formatRole).join(", ");
}

/**
 * Trunca un texto a una longitud máxima.
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima (default: 50)
 * @returns Texto truncado con "..." si excede el límite
 */
export function truncate(text?: string | null, maxLength = 50): string {
  if (!text) return "-";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Formatea un número con separadores de miles.
 * @param value - Número a formatear
 * @returns Número formateado o "-" si no es válido
 */
export function formatNumber(value?: number | null): string {
  if (value === null || value === undefined) return "-";
  return value.toLocaleString();
}

/**
 * Formatea un valor monetario.
 * @param value - Valor numérico
 * @param currency - Código de moneda (default: "USD")
 * @returns Valor formateado como moneda
 */
export function formatCurrency(
  value?: number | null,
  currency = "USD"
): string {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * Formatea un rango de fechas (inicio - fin).
 * @param inicio - Fecha de inicio en formato ISO string
 * @param fin - Fecha de fin en formato ISO string (opcional)
 * @returns Rango de fechas formateado o "-" si no es válido
 */
export function formatDateRange(
  inicio?: string | null,
  fin?: string | null
): string {
  if (!inicio) return "-";
  const startDate = new Date(inicio);
  const endDate = fin ? new Date(fin) : null;

  if (Number.isNaN(startDate.getTime())) return "-";

  const startStr = startDate.toLocaleDateString("es-EC", {
    day: "numeric",
    month: "short",
  });

  if (!endDate || Number.isNaN(endDate.getTime())) {
    return `${startStr}, ${startDate.getFullYear()}`;
  }

  const endStr = endDate.toLocaleDateString("es-EC", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `${startStr} - ${endStr}`;
}

/**
 * Formatea la ubicación de un evento (ciudad, país).
 * @param location - Objeto con ciudad y país
 * @returns Ubicación formateada o "-" si no existe
 */
export function formatLocation(location?: {
  ciudad?: string | null;
  pais?: string | null;
}): string {
  if (!location) return "-";
  const parts = [location.ciudad, location.pais].filter(Boolean);
  return parts.length ? parts.join(", ") : "-";
}

/**
 * Formatea la ubicación de un evento con provincia (ciudad, provincia, país).
 * @param location - Objeto con ciudad, provincia y país
 * @returns Ubicación formateada o "-" si no existe
 */
export function formatLocationWithProvince(location?: {
  ciudad?: string | null;
  provincia?: string | null;
  pais?: string | null;
}): string {
  if (!location) return "-";
  const parts = [location.ciudad, location.provincia, location.pais].filter(
    Boolean
  );
  return parts.length ? parts.join(", ") : "-";
}
