export type MonthlyStat = {
  year: number;
  month: number;
  total: string;
  count: number;
};

export type CategoryStat = {
  category_id: number | null;
  category_name: string | null;
  total: string;
  count: number;
};
