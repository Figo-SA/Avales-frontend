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

### Tipos (types/)

Archivo: `types/{dominio}.ts`

**Reglas:**
- Definir el tipo principal de la entidad con todos los campos que retorna la API
- Relaciones como objetos opcionales (ej: `categoria?: CatalogItem`)
- IDs de relaciones como campos separados para formularios (ej: `categoriaId?: number`)
- Definir tipo de respuesta de listado si difiere del array simple

### Validación (lib/validation/)

Archivo: `lib/validation/{dominio}.ts`

**Contenido:**
- Schema Zod con validaciones y mensajes en español
- Tipo `{Entidad}FormValues` inferido del schema
- Tipo `Create{Entidad}Payload` con la estructura exacta que espera la API
- Tipo `Update{Entidad}Payload` como Partial del Create

**Reglas:**
- Mensajes de validación descriptivos en español
- Valores enum en el payload deben ser uppercase (como espera la API)

### API (lib/api/)

Archivo: `lib/api/{dominio}.ts`

**Funciones estándar por módulo:**

| Función | Método HTTP | Endpoint |
|---------|-------------|----------|
| `list{Dominio}(options)` | GET | `/{dominio}` |
| `get{Dominio}(id)` | GET | `/{dominio}/{id}` |
| `create{Dominio}(payload)` | POST | `/{dominio}` |
| `update{Dominio}(id, payload)` | PATCH | `/{dominio}/{id}` |
| `softDelete{Dominio}(id)` | DELETE | `/{dominio}/{id}` |
| `restore{Dominio}(id)` | POST | `/{dominio}/{id}/recuperar` |
| `hardDelete{Dominio}(id)` | DELETE | `/{dominio}/{id}/definitivo` |

**Reglas:**
- Definir tipo `List{Dominio}Options` para parámetros de listado
- Usar `URLSearchParams` para construir query strings
- Todas las funciones usan `apiFetch` con el tipo de retorno apropiado

### Página de Listado

Archivo: `app/(app)/{modulo}/page.tsx`

**Estado requerido:**
- Filtros sincronizados con URL (query, page)
- Datos de la lista y metadata de paginación
- Estados de loading y error
- Toast para feedback de acciones
- Modal de confirmación para eliminación

**Comportamiento:**
- Fetch inicial y al cambiar filtros/página
- Sincronizar filtros con query params de la URL
- Mostrar toast desde query params (`status=created`, `status=updated`)
- Auto-hide del toast después de 4 segundos

**Componentes utilizados:**
- `AlertBanner` para toasts
- `ConfirmModal` para confirmación de eliminación
- `Pagination` para navegación de páginas
- Tabla del módulo desde `_components`

### Formulario Reutilizable

Archivo: `app/(app)/{modulo}/_components/{modulo}-form.tsx`

**Props:**
- `mode`: "create" | "edit"
- `{entidad}?`: datos para modo edición
- `onCreated?`: callback después de crear
- `onUpdated?`: callback después de actualizar

**Comportamiento:**
- Valores iniciales vacíos o mapeados desde la entidad
- React Hook Form con zodResolver
- Transformar valores del form al formato del payload API antes de enviar
- Manejar errores de campo específico desde `ApiError`
- Reset del form después de crear exitosamente

**Funciones auxiliares:**
- `EMPTY_VALUES`: valores iniciales para modo creación
- `mapToFormValues()`: transforma entidad API a valores del form

### Componente de Tabla

Archivo: `app/(app)/{modulo}/_components/{modulo}-table.tsx`

**Props:**
- `{entidades}`: array de datos
- `loading?`: estado de carga
- `error?`: mensaje de error
- `onDelete?`: callback para eliminación

**Estados visuales:**
- Loading: mensaje "Cargando..."
- Error: mensaje en rojo
- Empty: mensaje "No hay datos."
- Data: filas con acciones de editar y eliminar

---

## Convenciones Generales

| Aspecto | Estándar |
|---------|----------|
| Idioma UI | Español |
| Directiva | `"use client"` en páginas interactivas |
| Imports | Usar alias `@/` |
| Tipos | Archivo separado en `types/` |
| Validación | Zod schema en `lib/validation/` |
| API | Funciones en `lib/api/` con `apiFetch` |
| Formularios | React Hook Form + zodResolver |
| Estilos | Tailwind CSS con dark mode (`dark:`) |
| Iconos | Lucide React |
| Fechas | date-fns |

## Nombres de Archivos

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Página | `page.tsx` | `app/(app)/deportistas/page.tsx` |
| Tipo | `{dominio}.ts` | `types/deportista.ts` |
| Validación | `{dominio}.ts` | `lib/validation/deportista.ts` |
| API | `{dominio}.ts` | `lib/api/deportistas.ts` |
| Componente interno | `{modulo}-{tipo}.tsx` | `_components/deportista-form.tsx` |
| Componente UI | `{nombre}.tsx` | `components/ui/pagination.tsx` |

## Variables de Entorno

- `NEXT_PUBLIC_API_URL` - URL base de la API (ej: `http://localhost:3000/api/v1`)
- `JWT_SECRET` - Secret para JWT

## Roles de Usuario

Los roles disponibles son: SUPER_ADMIN, ADMIN, SECRETARIA, DTM, DTM_EIDE, ENTRENADOR, USUARIO, DEPORTISTA, PDA, FINANCIERO

---

## Módulo de Referencia

Ver `app/(app)/deportistas/` como implementación de referencia de estas convenciones.
