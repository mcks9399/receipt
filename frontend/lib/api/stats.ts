import { apiGet } from "@/lib/api/client";
import type { CategoryStat, MonthlyStat } from "@/types/stats";

export function getMonthlyStats(year?: number): Promise<MonthlyStat[]> {
  const qs = year ? `?year=${year}` : "";
  return apiGet<MonthlyStat[]>(`/stats/monthly${qs}`);
}

export function getCategoryStats(year?: number, month?: number): Promise<CategoryStat[]> {
  const query = new URLSearchParams();
  if (year !== undefined) query.set("year", String(year));
  if (month !== undefined) query.set("month", String(month));
  const qs = query.toString();
  return apiGet<CategoryStat[]>(`/stats/by-category${qs ? `?${qs}` : ""}`);
}
