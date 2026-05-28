import { listCategories } from "@/lib/api/categories";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await listCategories();
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">카테고리</h1>
      <ul className="divide-y divide-slate-200 rounded border border-slate-200 bg-white">
        {categories.length === 0 ? (
          <li className="p-4 text-sm text-slate-500">등록된 카테고리가 없습니다.</li>
        ) : (
          categories.map((c) => (
            <li key={c.id} className="px-4 py-2 text-sm">
              {c.name}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
