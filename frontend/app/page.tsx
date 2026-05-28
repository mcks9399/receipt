import Link from "next/link";
import { listReceipts } from "@/lib/api/receipts";
import { getCategoryStats, getMonthlyStats } from "@/lib/api/stats";
import { formatCurrency, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const [recent, monthly, byCategory] = await Promise.all([
    listReceipts(),
    getMonthlyStats(year),
    getCategoryStats(year, month),
  ]);

  const thisMonth = monthly.find((m) => m.year === year && m.month === month);
  const thisMonthTotal = thisMonth ? Number(thisMonth.total) : 0;
  const thisMonthCount = thisMonth?.count ?? 0;

  const categoryTotal = byCategory.reduce((sum, c) => sum + Number(c.total), 0);
  const top5 = recent.slice(0, 5);

  return (
    <section className="space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
          <p className="text-sm text-slate-600">
            {year}년 {month}월 지출 요약
          </p>
        </div>
        <Link
          href="/receipts/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          영수증 등록
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="이번 달 지출"
          value={formatCurrency(thisMonthTotal)}
          sub={`${thisMonthCount}건`}
          accent
        />
        <SummaryCard
          label="카테고리 수"
          value={`${byCategory.length}`}
          sub="이번 달 사용 카테고리"
        />
        <SummaryCard
          label="총 영수증"
          value={`${recent.length}`}
          sub="누적 등록"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Panel title="카테고리별 지출 (이번 달)" empty={byCategory.length === 0}>
          <ul className="space-y-3">
            {byCategory.map((c) => {
              const total = Number(c.total);
              const pct = categoryTotal > 0 ? (total / categoryTotal) * 100 : 0;
              return (
                <li key={`${c.category_id ?? "none"}`}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">{c.category_name ?? "미지정"}</span>
                    <span className="tabular-nums text-slate-600">
                      {formatCurrency(total)} <span className="text-xs">({pct.toFixed(0)}%)</span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel title="월별 추이" empty={monthly.length === 0}>
          <MonthlyBars data={monthly} />
        </Panel>
      </div>

      <Panel title="최근 영수증" empty={top5.length === 0} action={
        <Link href="/receipts" className="text-sm text-blue-600 hover:underline">
          전체 보기 →
        </Link>
      }>
        <ul className="divide-y divide-slate-100">
          {top5.map((r) => (
            <li key={r.id}>
              <Link
                href={`/receipts/${r.id}`}
                className="flex items-center justify-between py-3 hover:bg-slate-50"
              >
                <div>
                  <div className="font-medium">{r.merchant}</div>
                  <div className="text-xs text-slate-500">
                    {formatDate(r.paid_at)}
                    {r.category?.name ? ` · ${r.category.name}` : ""}
                  </div>
                </div>
                <span className="font-semibold tabular-nums">{formatCurrency(r.total)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded border p-4 ${
        accent ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-bold tabular-nums ${accent ? "text-blue-700" : ""}`}>
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

function Panel({
  title,
  children,
  empty,
  action,
}: {
  title: string;
  children: React.ReactNode;
  empty?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {empty ? <p className="text-sm text-slate-500">데이터가 없습니다.</p> : children}
    </div>
  );
}

function MonthlyBars({
  data,
}: {
  data: { year: number; month: number; total: string; count: number }[];
}) {
  const sorted = [...data]
    .sort((a, b) => a.year - b.year || a.month - b.month)
    .slice(-6);
  const max = Math.max(...sorted.map((m) => Number(m.total)), 1);
  return (
    <div className="flex items-end gap-2 h-40">
      {sorted.map((m) => {
        const total = Number(m.total);
        const h = (total / max) * 100;
        return (
          <div key={`${m.year}-${m.month}`} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t bg-blue-400"
                style={{ height: `${Math.max(h, 4)}%` }}
                title={formatCurrency(total)}
              />
            </div>
            <div className="text-xs text-slate-500">{m.month}월</div>
          </div>
        );
      })}
    </div>
  );
}
