import { apiDelete, apiForm, apiGet, apiJson } from "@/lib/api/client";
import type { Receipt, ReceiptInput } from "@/types/receipt";

export function listReceipts(params?: {
  year?: number;
  month?: number;
  category_id?: number;
}): Promise<Receipt[]> {
  const query = new URLSearchParams();
  if (params?.year !== undefined) query.set("year", String(params.year));
  if (params?.month !== undefined) query.set("month", String(params.month));
  if (params?.category_id !== undefined) query.set("category_id", String(params.category_id));
  const qs = query.toString();
  return apiGet<Receipt[]>(`/receipts${qs ? `?${qs}` : ""}`);
}

export function getReceipt(id: number): Promise<Receipt> {
  return apiGet<Receipt>(`/receipts/${id}`);
}

export function createReceipt(payload: ReceiptInput): Promise<Receipt> {
  return apiJson<Receipt>("POST", "/receipts", payload);
}

export function uploadReceipt(payload: ReceiptInput, image: File): Promise<Receipt> {
  const form = new FormData();
  form.append("merchant", payload.merchant);
  form.append("total", String(payload.total));
  form.append("paid_at", payload.paid_at);
  if (payload.memo) form.append("memo", payload.memo);
  if (payload.category_id !== null && payload.category_id !== undefined) {
    form.append("category_id", String(payload.category_id));
  }
  form.append("image", image);
  return apiForm<Receipt>("POST", "/receipts/upload", form);
}

export function updateReceipt(id: number, payload: Partial<ReceiptInput>): Promise<Receipt> {
  return apiJson<Receipt>("PATCH", `/receipts/${id}`, payload);
}

export function deleteReceipt(id: number): Promise<void> {
  return apiDelete(`/receipts/${id}`);
}
