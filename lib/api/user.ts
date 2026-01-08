import { apiFetch } from "@/lib/api/client";
import type { User, UserListResponse } from "@/types/user";
import type {
  ProfileFormValues,
  CreateUserFormValues,
  UpdateUserFormValues,
} from "@/lib/validation/user";

export type ListUsersOptions = {
  query?: string;
  page?: number;
  limit?: number;
  rol?: string;
<<<<<<< HEAD
  genero?: string;
};

export type ListEntrenadoresOptions = {
  page?: number;
  limit?: number;
  genero?: string;
=======
  sexo?: string;
>>>>>>> origin/main
};

export async function listUsers(options: ListUsersOptions = {}) {
  const params = new URLSearchParams();

  if (options.query) params.set("query", options.query);
  if (options.page) params.set("page", String(options.page));
  if (options.limit) params.set("limit", String(options.limit));
  if (options.rol) params.set("rol", options.rol);
<<<<<<< HEAD
  if (options.genero) params.set("genero", options.genero);
=======
  if (options.sexo) params.set("sexo", options.sexo);
>>>>>>> origin/main

  const qs = params.toString();
  const url = qs ? `/users?${qs}` : "/users";

  return apiFetch<UserListResponse>(url, { method: "GET" });
}

export async function listEntrenadores(options: ListEntrenadoresOptions = {}) {
  const params = new URLSearchParams();

  if (options.page) params.set("page", String(options.page));
  if (options.limit) params.set("limit", String(options.limit));
  if (options.genero) params.set("genero", options.genero);

  const qs = params.toString();
  const url = qs ? `/users/entrenadores?${qs}` : "/users/entrenadores";

  return apiFetch<UserListResponse>(url, { method: "GET" });
}

export async function getUser(id: number) {
  return apiFetch<User>(`/users/${id}`, { method: "GET" });
}

export async function createUser(values: CreateUserFormValues) {
  return apiFetch<User>("/users/create", {
    method: "POST",
    body: JSON.stringify(values),
  });
}

export async function updateUser(
  id: number,
  values: UpdateUserFormValues | ProfileFormValues
) {
  return apiFetch<User>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(values),
  });
}

export async function softDeleteUser(id: number) {
  return apiFetch<{ id: number }>(`/users/${id}`, { method: "DELETE" });
}

export async function restoreUser(id: number) {
  return apiFetch<User>(`/users/${id}/restore`, { method: "POST" });
}

export async function listDeletedUsers() {
  return apiFetch<User[]>("/users/deleted", { method: "GET" });
}

export async function updateProfile(values: ProfileFormValues) {
  return apiFetch<User>("/users/profile", {
    method: "PATCH",
    body: JSON.stringify(values),
  });
}

export async function updatePushToken(pushToken: string) {
  return apiFetch<User>("/users/me/push-token", {
    method: "PATCH",
    body: JSON.stringify({ pushToken }),
  });
}
