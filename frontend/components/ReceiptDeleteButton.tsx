"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteReceipt } from "@/lib/api/receipts";

export default function ReceiptDeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!confirm("이 영수증을 삭제할까요?")) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteReceipt(id);
      router.push("/receipts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제에 실패했습니다.");
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="rounded border border-red-200 bg-white px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        {deleting ? "삭제 중..." : "삭제"}
      </button>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
