# Errores de la API

La API centraliza sus errores en un solo filtro global (`src/common/filters/global-exception.filter.ts`). Cada excepción se traduce a un objeto [RFC 7807 Problem Details](https://datatracker.ietf.org/doc/html/rfc7807), pero con algunas extensiones propias:

| Campo | Descripción |
| --- | --- |
| `type` | URI que identifica la clase de error. Se construye usando `ERRORS_BASE_URL` (por defecto `https://api.tu-dominio.com/errors`). |
| `title` | Mensaje corto del error. |
| `status` | Código HTTP que se devuelve. |
| `detail` | Mensaje largo o contexto adicional. |
| `instance` | Ruta de la petición. |
| `requestId` | UUID generado por el servidor (extensión útil para trazas). |
| `apiVersion` | Versión de la API. |
| `durationMs` | Duración de la petición (si hay middleware de timing). |
| `...extensions` | Otros datos definidos por cada manejador (`PrismaValidationErrorHandler`, `HttpErrorHandler`, etc.). |

Los manejadores que se comprueban en orden son:

1. `AuthExceptionHandler` (401/403) – intercepta errores de autenticación/autorización antes del resto.
2. `PrismaKnownErrorHandler` – convierte errores conocidos del ORM en Problem Details específicos.
3. `PrismaUnknownErrorHandler` – captura errores inesperados del ORM.
4. `PrismaValidationErrorHandler` – agrupa errores de validación del esquema de Prisma.
5. `HttpErrorHandler` – transforma errores HTTP explícitos en Problem Details.
6. `DefaultErrorHandler` – fallback para cualquier `Error` genérico.

Si ninguno de los manejadores aplica se usa el fallback, por lo que siempre se responde con `ProblemDetails`.

### Ejemplo de respuesta de error

```json
{
  "type": "https://api.tu-dominio.com/errors/deportistas-invalidos",
  "title": "Datos inválidos para el deportista",
  "status": 422,
  "detail": "La cédula ya se encuentra registrada.",
  "instance": "/api/v1/deportistas",
  "requestId": "0f4f5a6c-4ec1-4a5f-a581-9d2f3d0c1ece",
  "apiVersion": "v1",
  "durationMs": 12
}
```

### Consumir errores desde el frontend

- El cliente (`lib/api/client.ts`) ya identifica `ProblemDetails` y lo expone en `ApiError.problem` para que los componentes puedan mostrar `detail` o `title`.
- El hook `useAuth` diferencia los códigos 401/403 para evitar mostrar errores cuando no hay sesión y puede inspeccionar `problem?.requestId` si es necesario.
- Para otros formularios se recomienda mostrar `problem?.detail` o una alerta genérica (`"No se pudo completar la acción."`) cuando `detail` no está presente.

Cuando modifiques los manejadores del backend o los códigos de error, actualiza también esta página para mantener la documentación alineada.
