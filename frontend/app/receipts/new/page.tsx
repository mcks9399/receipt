import ReceiptForm from "@/components/ReceiptForm";
import { listCategories } from "@/lib/api/categories";

export const dynamic = "force-dynamic";

export default async function NewReceiptPage() {
  const categories = await listCategories();
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">영수증 등록</h1>
      <ReceiptForm categories={categories} />
    </section>
  );
}
