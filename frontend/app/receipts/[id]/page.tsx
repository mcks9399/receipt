import { getReceipt } from "@/lib/api/receipts";
import { formatCurrency, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ReceiptDetailPage({ params }: { params: { id: string } }) {
  const receipt = await getReceipt(Number(params.id));
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">{receipt.merchant}</h1>
      <dl className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
        <dt className="text-slate-500">금액</dt>
        <dd>{formatCurrency(receipt.total)}</dd>
        <dt className="text-slate-500">결제일</dt>
        <dd>{formatDate(receipt.paid_at)}</dd>
        <dt className="text-slate-500">카테고리</dt>
        <dd>{receipt.category_id ?? "-"}</dd>
        <dt className="text-slate-500">메모</dt>
        <dd>{receipt.memo ?? "-"}</dd>
      </dl>
    </section>
  );
}
