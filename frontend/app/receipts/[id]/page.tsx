import Link from "next/link";
import { getReceipt } from "@/lib/api/receipts";
import { BASE_URL } from "@/lib/api/client";
import { formatCurrency, formatDate } from "@/lib/format";
import ReceiptDeleteButton from "@/components/ReceiptDeleteButton";

export const dynamic = "force-dynamic";

export default async function ReceiptDetailPage({ params }: { params: { id: string } }) {
  const receipt = await getReceipt(Number(params.id));
  const imageSrc = receipt.image_url ? `${BASE_URL}${receipt.image_url}` : null;

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/receipts" className="text-sm text-slate-500 hover:underline">
            ← 목록으로
          </Link>
          <h1 className="mt-1 text-2xl font-bold">{receipt.merchant}</h1>
          <p className="text-sm text-slate-500">{formatDate(receipt.paid_at)}</p>
        </div>
        <ReceiptDeleteButton id={receipt.id} />
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="rounded border border-slate-200 bg-white p-6">
          <div className="mb-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">결제 금액</div>
            <div className="mt-1 text-3xl font-bold tabular-nums">
              {formatCurrency(receipt.total)}
            </div>
          </div>

          <dl className="grid grid-cols-[100px_1fr] gap-y-3 border-t border-slate-100 pt-4 text-sm">
            <dt className="text-slate-500">카테고리</dt>
            <dd>
              {receipt.category?.name ? (
                <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-xs">
                  {receipt.category.name}
                </span>
              ) : (
                <span className="text-slate-400">미지정</span>
              )}
            </dd>

            <dt className="text-slate-500">결제일</dt>
            <dd className="tabular-nums">{formatDate(receipt.paid_at)}</dd>

            <dt className="text-slate-500">메모</dt>
            <dd className="whitespace-pre-wrap">
              {receipt.memo ? receipt.memo : <span className="text-slate-400">-</span>}
            </dd>

            <dt className="text-slate-500">등록일</dt>
            <dd className="text-xs text-slate-500 tabular-nums">
              {formatDate(receipt.created_at)}
            </dd>
          </dl>
        </div>

        <div className="rounded border border-slate-200 bg-white p-4">
          <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">영수증 이미지</div>
          {imageSrc ? (
            <a
              href={imageSrc}
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden rounded border border-slate-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={`${receipt.merchant} 영수증`}
                className="h-auto w-full object-contain"
              />
            </a>
          ) : (
            <p className="rounded border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
              이미지 없음
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
