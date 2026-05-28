import { apiDelete, apiGet, apiJson } from "@/lib/api/client";
import type { Category } from "@/types/category";

export function listCategories(): Promise<Category[]> {
  return apiGet<Category[]>("/categories");
}

export function createCategory(name: string): Promise<Category> {
  return apiJson<Category>("POST", "/categories", { name });
}

export function deleteCategory(id: number): Promise<void> {
  return apiDelete(`/categories/${id}`);
}
