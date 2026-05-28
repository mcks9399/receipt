export type Receipt = {
  id: number;
  merchant: string;
  total: string;
  paid_at: string;
  memo: string | null;
  image_path: string | null;
  category_id: number | null;
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
