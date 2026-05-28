"use client";

import type { Category } from "@/types/category";

type Props = {
  categories: Category[];
  value: number | null;
  onChange: (value: number | null) => void;
};

export default function CategorySelect({ categories, value, onChange }: Props) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
      className="w-full rounded border border-slate-300 px-3 py-2"
    >
      <option value="">미지정</option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
