import { apiFetch } from "@/lib/api/client";
import type { User, UserListResponse } from "@/types/user";
import type {
  ProfileFormValues,
  CreateUserFormValues,
  UpdateUserFormValues,
} from "@/lib/validation/user";

export async function getUser(userId: number) {
  return apiFetch<User>(`/users/${userId}`, { method: "GET" });
}

export async function updateUser(
  userId: number,
  values: UpdateUserFormValues | ProfileFormValues
) {
  return apiFetch<User>(`/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(values),
  });
}

export type ListUsersOptions = {
  query?: string;
  page?: number;
  limit?: number;
};

export async function listUsers(options: ListUsersOptions = {}) {
  const params = new URLSearchParams();

  if (options.query) params.set("query", options.query);
  if (options.page) params.set("page", String(options.page));
  if (options.limit) params.set("limit", String(options.limit));

  const qs = params.toString();
  const url = qs ? `/users?${qs}` : "/users";

  return apiFetch<UserListResponse>(url, { method: "GET" });
}

export async function createUser(values: CreateUserFormValues) {
  return apiFetch<User>("/users/create", {
    method: "POST",
    body: JSON.stringify(values),
  });
}

export async function deleteUser(userId: number) {
  return apiFetch(`/users/${userId}`, { method: "DELETE" });
}
