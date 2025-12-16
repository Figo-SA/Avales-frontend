import { apiFetch } from "./client";
import type { User } from "@/types/user";

export async function login(email: string, password: string) {
  // Tu backend devuelve el token en cookie HttpOnly, el body puede traer data también
  return apiFetch<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return apiFetch<null>("/auth/logout", { method: "POST" });
}

export async function getProfile() {
  return apiFetch<User>("/auth/profile", { method: "GET" });
}
