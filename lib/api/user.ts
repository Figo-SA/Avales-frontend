import { apiFetch } from "@/lib/api/client";
import type { User } from "@/types/user";
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

export async function listUsers() {
  return apiFetch<User[]>("/users", { method: "GET" });
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
