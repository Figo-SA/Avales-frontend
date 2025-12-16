import { apiFetch } from "@/lib/api/client";
import type { User } from "@/types/user";
import type { ProfileFormValues } from "@/lib/validation/user";

export async function updateUser(userId: number, values: ProfileFormValues) {
  return apiFetch<User>(`/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(values),
  });
}
