import { apiFetch } from "@/lib/api/client";
import type { CatalogItem } from "@/types/catalog";

export function getCatalog() {
  return apiFetch<{ categorias: CatalogItem[]; disciplinas: CatalogItem[] }>(
    "/catalog"
  );
}

export function getCategorias() {
  return apiFetch<CatalogItem[]>("/catalog/categorias");
}

export function getDisciplinas() {
  return apiFetch<CatalogItem[]>("/catalog/disciplinas");
}
