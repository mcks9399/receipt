import type { Category } from "@/types/category";

export type Receipt = {
  id: number;
  merchant: string;
  total: string;
  paid_at: string;
  memo: string | null;
  image_path: string | null;
  image_url: string | null;
  category_id: number | null;
  category: Category | null;
  created_at: string;
  updated_at: string;
};

export type ReceiptInput = {
  merchant: string;
  total: string;
  paid_at: string;
  memo: string | null;
  category_id: number | null;
};

export type ReceiptOCRPreview = {
  merchant: string | null;
  total: string | null;
  paid_at: string | null;
  confidence: number | null;
};
