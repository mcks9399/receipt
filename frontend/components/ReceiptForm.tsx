"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createReceipt, uploadReceipt } from "@/lib/api/receipts";
import type { Category } from "@/types/category";
import CategorySelect from "@/components/CategorySelect";

export default function ReceiptForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [merchant, setMerchant] = useState("");
  const [total, setTotal] = useState("");
  const [paidAt, setPaidAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [memo, setMemo] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        merchant,
        total,
        paid_at: paidAt,
        memo: memo || null,
        category_id: categoryId,
      };
      if (image) {
        await uploadReceipt(payload, image);
      } else {
        await createReceipt(payload);
      }
      router.push("/receipts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded border border-slate-200 bg-white p-6">
      <Field label="가맹점">
        <input
          required
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
      </Field>
      <Field label="금액">
        <input
          required
          type="number"
          min="0"
          step="0.01"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
      </Field>
      <Field label="결제일">
        <input
          required
          type="date"
          value={paidAt}
          onChange={(e) => setPaidAt(e.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
      </Field>
      <Field label="카테고리">
        <CategorySelect categories={categories} value={categoryId} onChange={setCategoryId} />
      </Field>
      <Field label="메모">
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={2}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
      </Field>
      <Field label="영수증 이미지 (선택)">
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          className="text-sm"
        />
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "등록 중..." : "등록"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
