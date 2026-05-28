import StatsChart from "@/components/StatsChart";
import { getCategoryStats, getMonthlyStats } from "@/lib/api/stats";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const [monthly, byCategory] = await Promise.all([getMonthlyStats(), getCategoryStats()]);
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">통계</h1>
        <p className="text-sm text-slate-600">월별 / 카테고리별 지출 집계</p>
      </div>
      <StatsChart monthly={monthly} byCategory={byCategory} />
    </section>
  );
}
