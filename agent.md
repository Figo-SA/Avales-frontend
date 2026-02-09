# Agent Context - Avales Frontend

## Resumen
Frontend para gestionar avales de una federación deportiva. Implementado con Next.js (App Router) y TypeScript. Consume una API REST (backend NestJS). UI en español, nombres de variables/componentes en inglés.

## Stack
- Next.js: ^16.0.10 (App Router)
- React: ^19.2.4
- TypeScript: ^5
- Tailwind CSS: ^4 (dark mode por clase)
- Formularios: react-hook-form + zod + @hookform/resolvers
- UI helpers: Headless UI, Radix Popover, lucide-react, react-day-picker, recharts

## Comandos
- `npm run dev` (puerto 4000)
- `npm run build`
- `npm run start`
- `npm run lint`

## Documentación Interna
- `CLAUDE.md`: convenciones y patrones de módulos, API, validación, tipos, layout, UI, etc.
- `docs/api-errors.md`: especificación RFC 7807 Problem Details usada por el backend y cómo manejarla en frontend.

## Estructura General
- `app/`: rutas y layouts (App Router)
- `components/`: UI reutilizable, layouts y formularios
- `lib/`: API client, validación, utilidades, navegación/roles
- `types/`: tipos TypeScript por dominio
- `public/`: assets estáticos

## Layouts y Rutas
- `app/layout.tsx`: layout raíz. Aplica fuentes, tema, auth y app providers.
- `app/(app)/layout.tsx`: layout protegido con `Sidebar` y `Header` (si aplica por rol).
- `app/(auth)/layout.tsx`: layout para rutas públicas (signin).
- `app/(fullscreen)/layout.tsx`: layout sin chrome (pantallas fullscreen).

### Rutas principales
- `app/page.tsx`: landing/root.
- `app/(auth)/signin/page.tsx`: login.
- `app/(app)/dashboard/page.tsx`
- `app/(app)/deportistas/page.tsx` + `nuevo`, `editar` + `_components`
- `app/(app)/usuarios/page.tsx` + `nuevo`, `editar` + `_components`
- `app/(app)/eventos/page.tsx` + `nuevo`, `editar` + `_components`
- `app/(app)/avales/page.tsx` + `nuevo`, `editar`, `_components`
- `app/(fullscreen)/avales/[id]/crear-solicitud/page.tsx`
- `app/(fullscreen)/avales/[id]/revision-metodologo/page.tsx`
- `app/(fullscreen)/avales/[id]/certificar-pda/page.tsx`
- `app/(app)/settings/profile/page.tsx`
- `app/not-found.tsx`: 404

## Providers y Contextos
- `app/providers/theme-provider.tsx`: `next-themes` (`class`)
- `app/providers/auth-provider.tsx`: obtiene perfil via API, maneja 401/403 como “no autenticado”
- `app/providers/app-provider.tsx`: estado de sidebar
- `app/selected-items-context.tsx`: selección de items
- `app/flyout-context.tsx`: estado de flyout

## Autenticación y Acceso
- `lib/api/auth.ts`: endpoints de auth (login, profile, logout)
- `lib/auth/access.ts`: helpers para filtrar items del sidebar por roles
- `lib/navigation/sidebar.config.ts`: configuración de sidebar por roles
- `proxy.ts`: lógica de redirección basada en cookie `token` (no es `middleware.ts`, revisar si se usa como middleware)

## Cliente API y Errores
- `lib/api/client.ts`: wrapper `apiFetch`
- Usa `NEXT_PUBLIC_API_URL` y `credentials: include`
- Respuesta exitosa en envelope `{ status, data, meta }`
- Errores en RFC 7807 Problem Details con clase `ApiError` (ver `docs/api-errors.md`)

## Tipos
- `types/*.ts`: entidades por dominio, respuestas de listados, tipos de paginación
- Roles (en `types/user.ts`): SUPER_ADMIN, ADMIN, SECRETARIA, DTM, METODOLOGO, ENTRENADOR, USUARIO, DEPORTISTA, PDA, CONTROL_PREVIO, COMPRAS_PUBLICAS, FINANCIERO

## Validación
- `lib/validation/*.ts`: schemas Zod por dominio
- Patrones usados:
- Esquema simple (create/update iguales)
- Base + extends (create/update difieren, p. ej. password)

## Constantes y Utilidades
- `lib/constants.ts`: PAGE_SIZE, TOAST_DURATION, estados de eventos/avales, estilos de badges, flujo de aprobación, roles, etc.
- `lib/utils/formatters.ts`: formato de fechas, enums, roles, moneda, etc.
- `lib/utils/aval-historial.ts`: helpers para historial de avales
- `lib/utils.ts`: utilidades generales

## UI y Componentes
- `components/layouts/`: `Sidebar`, `Header`
- `components/ui/`: `AlertBanner`, `ConfirmModal`, `Pagination`, `Calendar`, `Steps`, `Popover`, etc.
- `components/forms/`: `DatePicker`, `SelectField`
- `components/events/`: modales/flows de eventos

## Estilos
- Tailwind CSS con dark mode por clase (`dark:`)
- `app/css/style.css` y `app/css/additional-styles/utility-patterns.css`
- `tailwind.config.ts` define breakpoints custom, shadows, font `inter`

## Variables de Entorno
- `NEXT_PUBLIC_API_URL` (requerida)
- `JWT_SECRET` (según `CLAUDE.md`)

## Notas de Convención (desde `CLAUDE.md`)
- UI en español, código en inglés.
- Usar alias `@/` para imports.
- CRUDs en `app/(app)/{modulo}` siguen estructura estándar con `_components`.
- Estado de listados: filtros, paginación, toasts, confirm modal, etc.
- `DEFAULT_PAGE_SIZE` y `TOAST_DURATION` de `lib/constants.ts`.

## Archivos Clave
- `README.md`: boilerplate Next.js
- `CLAUDE.md`: guía detallada del proyecto
- `docs/api-errors.md`: especificación de errores API
- `package.json`: scripts y dependencias
- `tsconfig.json`: paths y strict mode
- `tailwind.config.ts`: tema UI
- `proxy.ts`: redirecciones por auth

## Assets
- `public/images/` contiene logos e imágenes de auth.

## Observaciones
- `types/user.ts` incluye rol `COMPRAS_PUBLICAS`, mientras `lib/constants.ts` no lo lista.
- `proxy.ts` no es middleware estándar; si se necesita, renombrar a `middleware.ts` o integrarlo.

## Flujo Operativo de Avales
1. Entrenador genera el aval.
2. PDA genera el presupuesto.
3. Compras públicas genera su certificación.
4. Revisión metodológica.
5. Revisión DTM.
6. Revisión Control Previo (última revisión).
7. Financiero aprueba el monto y finaliza el proceso.
