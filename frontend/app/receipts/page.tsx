import { listReceipts } from "@/lib/api/receipts";
import ReceiptList from "@/components/ReceiptList";

export const dynamic = "force-dynamic";

export default async function ReceiptsPage() {
  const receipts = await listReceipts();
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">영수증 목록</h1>
      <ReceiptList receipts={receipts} />
    </section>
  );
}
