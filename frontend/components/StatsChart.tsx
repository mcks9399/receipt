import type { CategoryStat, MonthlyStat } from "@/types/stats";
import { formatCurrency } from "@/lib/format";

type Props = {
  monthly: MonthlyStat[];
  byCategory: CategoryStat[];
};

export default function StatsChart({ monthly, byCategory }: Props) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="rounded border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">월별</h2>
        {monthly.length === 0 ? (
          <p className="text-sm text-slate-500">데이터 없음</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {monthly.map((m) => (
              <li key={`${m.year}-${m.month}`} className="flex justify-between">
                <span>
                  {m.year}년 {m.month}월
                </span>
                <span className="tabular-nums">{formatCurrency(m.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">카테고리별</h2>
        {byCategory.length === 0 ? (
          <p className="text-sm text-slate-500">데이터 없음</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {byCategory.map((c, idx) => (
              <li key={`${c.category_id ?? "none"}-${idx}`} className="flex justify-between">
                <span>{c.category_name ?? "미지정"}</span>
                <span className="tabular-nums">{formatCurrency(c.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
