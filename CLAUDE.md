# CLAUDE.md

Este archivo proporciona guía a Claude Code (claude.ai/code) para trabajar con el código de este repositorio.

## Descripción del Proyecto

Frontend en Next.js 14 (App Router) con TypeScript para gestionar "avales" de una federación deportiva. Consume la API REST del backend NestJS.

## Comandos Comunes

- `pnpm dev` - Servidor de desarrollo en localhost:3000
- `pnpm build` - Build de producción
- `pnpm start` - Servidor de producción
- `pnpm lint` - ESLint

## Arquitectura

### Estructura General

- `app/(app)/` - Rutas protegidas que requieren autenticación
- `app/(auth)/` - Rutas públicas (signin)
- `app/providers/` - Context providers de la aplicación
- `lib/api/` - Funciones de llamadas a la API por dominio
- `lib/api/client.ts` - Wrapper `apiFetch` base para todas las peticiones
- `lib/validation/` - Schemas Zod por dominio
- `lib/constants.ts` - Constantes globales (PAGE_SIZE, TOAST_DURATION, etc.)
- `lib/utils/formatters.ts` - Funciones de formato centralizadas
- `lib/navigation/` - Configuración del sidebar y roles
- `types/` - Tipos TypeScript por dominio
- `components/ui/` - Componentes reutilizables de UI
- `components/forms/` - Campos de formulario reutilizables

### Patrones de Consumo de API

- Todas las peticiones usan el wrapper `apiFetch` de `lib/api/client.ts`
- Las respuestas exitosas vienen envueltas en `{ data, meta }` donde `meta` contiene paginación
- Los errores siguen RFC 7807 Problem Details y se manejan con la clase `ApiError`

---

## Convenciones para Crear Módulos

### Idioma del Código

- **Nombres de funciones, variables, componentes**: En inglés
- **Textos de UI, labels, mensajes**: En español
- **Campos de tipos y validación**: En español, deben coincidir con la API

### Estructura de Carpetas por Módulo

Cada módulo CRUD sigue esta estructura dentro de `app/(app)/`:

```
app/(app)/{modulo}/
├── page.tsx
├── nuevo/
│   └── page.tsx
├── [id]/
│   └── editar/
│       └── page.tsx
└── _components/
    ├── {modulo}-form.tsx
    └── {modulo}-table.tsx
```

### Archivos y su Propósito

| Archivo | Propósito |
|---------|-----------|
| `page.tsx` | Listado principal con tabla, filtros y paginación |
| `nuevo/page.tsx` | Página de creación, usa el form de `_components` |
| `[id]/editar/page.tsx` | Página de edición, carga datos y usa el form |
| `_components/{modulo}-form.tsx` | Formulario reutilizable para crear y editar |
| `_components/{modulo}-table.tsx` | Tabla del listado con acciones |

---

## Constantes Globales (lib/constants.ts)

Archivo centralizado para valores reutilizables:

| Constante | Valor | Uso |
|-----------|-------|-----|
| `DEFAULT_PAGE_SIZE` | 10 | Items por página en listados |
| `TOAST_DURATION` | 4000 | Milisegundos antes de ocultar toast |
| `CONFIRM_CLEANUP_DELAY` | 180 | Delay para limpiar item de confirmación |
| `ROLES` | Array | Roles disponibles en el sistema |
| `GENERO_OPTIONS` | Array | Opciones de género para formularios |
| `EVENTO_ESTADOS` | Array | Estados posibles de eventos |
| `EVENTO_STATUS_STYLES` | Record | Clases CSS por estado de evento |

**Funciones disponibles:**
- `getEventoStatusClasses(status)` - Obtiene clases CSS para badge de estado

---

## Funciones de Formato (lib/utils/formatters.ts)

Funciones centralizadas para formateo en tablas y componentes:

| Función | Descripción |
|---------|-------------|
| `formatDate(value)` | Fecha ISO a formato local |
| `formatDateTime(value)` | Fecha y hora a formato local |
| `formatGenero(genero)` | Código de género a texto legible |
| `formatBoolean(value, labels)` | Booleano a texto personalizado |
| `formatEnum(value, map)` | Enum a etiqueta usando mapa |
| `formatRole(role)` | Rol a texto legible (SUPER_ADMIN → "Super Admin") |
| `formatRoles(roles)` | Array de roles a texto separado por coma |
| `truncate(text, maxLength)` | Trunca texto con "..." |
| `formatNumber(value)` | Número con separadores de miles |
| `formatCurrency(value, currency)` | Valor como moneda |

**Uso en tablas:**
- Importar desde `@/lib/utils/formatters`
- Todas las funciones manejan `null`/`undefined` devolviendo "-"

---

## Tipos (types/)

Archivo: `types/{dominio}.ts`

**Contenido estándar:**
- Tipo principal de la entidad con todos los campos que retorna la API
- Tipo de respuesta de listado

**Reglas:**
- Relaciones como objetos opcionales: `categoria?: CatalogItem`
- IDs de relaciones como campos separados: `categoriaId?: number`
- Campos que pueden ser null desde API: `campo: string | null`
- Campos que pueden no existir: `campo?: string`
- Fechas como strings ISO 8601

---

## Validación (lib/validation/)

Archivo: `lib/validation/{dominio}.ts`

### Patrón Simple (un solo schema)

Para entidades donde create y update tienen los mismos campos requeridos:

**Estructura:**
- `{dominio}Schema` - Schema Zod único
- `{Entidad}FormValues` - Tipo inferido del schema
- `Create{Entidad}Payload` - Tipo para la API (puede transformar valores)
- `Update{Entidad}Payload` - `Partial<Create{Entidad}Payload>`

**Ejemplo:** `deportista.ts` - donde todos los campos son iguales para crear y editar

### Patrón Base + Extends (schemas diferenciados)

Para entidades donde create y update tienen campos diferentes (ej: password requerido en create, opcional en update):

**Estructura:**
- `base{Entidad}Schema` - Schema con campos compartidos (privado)
- `create{Entidad}Schema` - Extiende base, agrega campos requeridos para crear
- `update{Entidad}Schema` - Extiende base, hace campos opcionales
- `Create{Entidad}FormValues` - Inferido de createSchema
- `Update{Entidad}FormValues` - Inferido de updateSchema
- `{Entidad}FormValues` - Alias del Update (usado en el form)
- `Create{Entidad}Payload` / `Update{Entidad}Payload` - Tipos para API

**Ejemplo:** `user.ts` - donde password es requerido al crear pero opcional al editar

**Cuándo usar cada patrón:**

| Situación | Patrón |
|-----------|--------|
| Mismos campos create/update | Simple |
| Password solo en create | Base + Extends |
| Campos condicionales | Base + Extends |
| Validaciones diferentes | Base + Extends |

### Reglas de Validación

- Mensajes en español descriptivos
- Strings: `.min()` y `.max()` para longitud
- IDs numéricos: `.number().int().positive("Mensaje")`
- Enums en form: valores lowercase
- Enums en payload: valores UPPERCASE (como espera la API)
- Campos opcionales: `.optional().or(z.literal(""))`

---

## API (lib/api/)

Archivo: `lib/api/{dominio}.ts`

**Tipo de opciones de listado:**
- `List{Dominio}Options` con: `query?`, `page?`, `limit?`, y filtros específicos

**Funciones estándar por módulo:**

| Función | Método | Endpoint |
|---------|--------|----------|
| `list{Dominio}(options)` | GET | `/{dominio}` |
| `get{Dominio}(id)` | GET | `/{dominio}/{id}` |
| `create{Dominio}(payload)` | POST | `/{dominio}` |
| `update{Dominio}(id, payload)` | PATCH | `/{dominio}/{id}` |
| `softDelete{Dominio}(id)` | DELETE | `/{dominio}/{id}` |
| `restore{Dominio}(id)` | POST | `/{dominio}/{id}/recuperar` |
| `hardDelete{Dominio}(id)` | DELETE | `/{dominio}/{id}/definitivo` |

**Reglas:**
- Usar `URLSearchParams` para construir query strings
- Todas las funciones retornan `apiFetch<T>` con el tipo apropiado
- El tipo `Update{Dominio}Payload` se define como `Partial<Create{Dominio}Payload>`

---

## Página de Listado

Archivo: `app/(app)/{modulo}/page.tsx`

**Constantes:**
- Importar `DEFAULT_PAGE_SIZE` desde `@/lib/constants` o definir `PAGE_SIZE = 10`

**Estado requerido:**
- `q` - Búsqueda de texto (sincronizado con URL param `query`)
- `{filtro}` - Filtros adicionales específicos del módulo
- `page` - Página actual (sincronizado con URL)
- `{entidades}` - Array de datos
- `loading` - Estado de carga
- `error` - Mensaje de error
- `pagination` - Objeto `{ page, limit, total }`
- `toast` - Objeto `{ variant: "success" | "error", message, description? }`
- `confirm{Entidad}` - Item seleccionado para eliminar
- `confirmOpen` - Estado del modal de confirmación
- `deleting` - Estado de eliminación en progreso

**Comportamiento estándar:**
- Fetch inicial y al cambiar filtros/página con `useCallback`
- Sincronizar filtros con query params de la URL
- Resetear página a 1 al cambiar filtros
- Mostrar toast desde query params (`?status=created`, `?status=updated`, `?status=error`)
- Limpiar status de URL después de mostrar toast
- Auto-hide del toast después de 4000ms (usar `TOAST_DURATION` de constants)

**Componentes utilizados:**
- `AlertBanner` para toasts (posición fixed top-right)
- `ConfirmModal` para confirmación de eliminación
- `Pagination` para navegación de páginas
- `{Entidad}Table` desde `_components`

**Estructura del header:**
- Título y descripción a la izquierda
- Input de búsqueda, filtros y botón "Nuevo {entidad}" a la derecha

---

## Formulario Reutilizable

Archivo: `app/(app)/{modulo}/_components/{modulo}-form.tsx`

**Constantes:**
- `EMPTY_FORM_VALUES` - Valores iniciales vacíos para modo creación
- `map{Entidad}ToFormValues(entity)` - Función para mapear entidad a valores del form

**Props del componente:**

| Prop | Tipo | Descripción |
|------|------|-------------|
| `mode` | `"create" \| "edit"` | Modo del formulario (default: "create") |
| `{entidad}?` | `{Entidad}` | Datos para modo edición |
| `onCreated?` | `() => Promise<void>` | Callback después de crear |
| `onUpdated?` | `() => Promise<void>` | Callback después de actualizar |

**Estado interno:**
- `submitError` - Mensaje de error del submit (solo errores, no mensajes de éxito)
- Estados para catálogos si aplica: `categorias`, `disciplinas`, `catalogLoading`, `catalogError`

**Comportamiento:**
- Usar `useMemo` para calcular `initialValues` según modo
- React Hook Form con `zodResolver`
- Cargar catálogos en `useEffect` inicial si son necesarios
- Reset del form con datos en modo edit cuando catálogos terminen de cargar
- Transformar valores del form al formato del payload API en `onSubmit`
- Manejar errores de campo específico desde `ApiError` con `setError`
- Reset del form a `EMPTY_FORM_VALUES` después de crear exitosamente

**Texto del botón submit:**
- Submitting: "Guardando..."
- Edit mode: "Guardar cambios"
- Create mode: "Guardar {entidad}"

---

## Componente de Tabla

Archivo: `app/(app)/{modulo}/_components/{modulo}-table.tsx`

**Props del componente:**

| Prop | Tipo | Descripción |
|------|------|-------------|
| `{entidades}` | `{Entidad}[]` | Array de datos |
| `loading?` | `boolean` | Estado de carga |
| `error?` | `string \| null` | Mensaje de error |
| `onDelete?` | `(item: {Entidad}) => void` | Callback para eliminación |

**Funciones de formato:**
- Usar funciones de `@/lib/utils/formatters` para formatos comunes
- Definir formatters específicos del dominio dentro del archivo si no son reutilizables

**Estados visuales de la tabla:**

| Condición | Render |
|-----------|--------|
| `loading` | Fila con "Cargando {entidades}..." |
| `error && !loading` | Fila con mensaje de error en rojo |
| `!loading && !error && items.length === 0` | Fila con "No hay {entidades} para mostrar." |
| `!loading && !error && items.length > 0` | Mapear items con sus filas |

**Columna de acciones:**
- Botón editar: Link a `/{modulo}/{id}/editar` con icono `Pencil`
- Botón eliminar: `onClick` que llama `onDelete` con icono `Trash2`
- Estilos hover: indigo para editar, rose para eliminar

---

## Páginas de Crear y Editar

### Página Crear: `nuevo/page.tsx`

**Comportamiento:**
- Callback `handleCreated` que redirige a `/{modulo}?status=created`
- Renderiza el form con `onCreated={handleCreated}`

### Página Editar: `[id]/editar/page.tsx`

**Estado:**
- `{entidad}` - Datos cargados
- `loading` - Estado de carga inicial
- `error` - Error de carga

**Comportamiento:**
- Obtener ID de `useParams`
- Cargar entidad en `useEffect` con `get{Entidad}(id)`
- Callback `handleUpdated` que redirige a `/{modulo}?status=updated`
- Mostrar loading/error mientras carga
- Renderiza el form con `mode="edit"`, `{entidad}={entidad}`, `onUpdated={handleUpdated}`

---

## Convenciones Generales

| Aspecto | Estándar |
|---------|----------|
| Idioma UI | Español |
| Directiva | `"use client"` en páginas interactivas |
| Imports | Usar alias `@/` |
| PAGE_SIZE | 10 (usar constante de `lib/constants.ts`) |
| TOAST_DURATION | 4000ms (usar constante de `lib/constants.ts`) |
| Tipos | Archivo separado en `types/` |
| Validación | Zod schema en `lib/validation/` |
| API | Funciones en `lib/api/` con `apiFetch` |
| Formularios | React Hook Form + zodResolver |
| Estilos | Tailwind CSS con dark mode (`dark:`) |
| Iconos | Lucide React |
| Fechas | Usar `formatDate` de `lib/utils/formatters` |
| Comentarios | Solo en código complejo, concisos |

## Nombres de Archivos

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Página | `page.tsx` | `app/(app)/deportistas/page.tsx` |
| Tipo | `{dominio}.ts` | `types/deportista.ts` |
| Validación | `{dominio}.ts` | `lib/validation/deportista.ts` |
| API | `{dominio}.ts` | `lib/api/deportistas.ts` |
| Componente form | `{modulo}-form.tsx` | `_components/deportista-form.tsx` |
| Componente table | `{modulo}-table.tsx` | `_components/deportista-table.tsx` |

## Parámetros de Query URL

| Parámetro | Uso |
|-----------|-----|
| `query` | Búsqueda de texto general |
| `page` | Número de página (solo si > 1) |
| `status` | Feedback de acciones: `created`, `updated`, `error` |
| `{filtro}` | Filtros específicos del módulo (ej: `sexo`, `estado`) |

## Variables de Entorno

- `NEXT_PUBLIC_API_URL` - URL base de la API
- `JWT_SECRET` - Secret para JWT

## Roles de Usuario

SUPER_ADMIN, ADMIN, SECRETARIA, DTM, DTM_EIDE, ENTRENADOR, USUARIO, DEPORTISTA, PDA, FINANCIERO

---

## Módulos de Referencia

- `app/(app)/deportistas/` - Patrón simple de validación, CRUD completo
- `app/(app)/usuarios/` - Patrón base+extends de validación (password opcional en update)
