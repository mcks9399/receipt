import Link from "next/link";
import type { Receipt } from "@/types/receipt";
import { formatCurrency, formatDate } from "@/lib/format";

export default function ReceiptList({ receipts }: { receipts: Receipt[] }) {
  if (receipts.length === 0) {
    return (
      <p className="rounded border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
        아직 등록된 영수증이 없습니다.{" "}
        <Link href="/receipts/new" className="text-blue-600 underline">
          새로 등록
        </Link>
      </p>
    );
  }

  return (
    <ul className="divide-y divide-slate-200 rounded border border-slate-200 bg-white">
      {receipts.map((r) => (
        <li key={r.id} className="flex items-center justify-between px-4 py-3">
          <Link href={`/receipts/${r.id}`} className="flex-1">
            <div className="font-medium">{r.merchant}</div>
            <div className="text-xs text-slate-500">{formatDate(r.paid_at)}</div>
          </Link>
          <span className="font-semibold tabular-nums">{formatCurrency(r.total)}</span>
        </li>
      ))}
    </ul>
  );
}
