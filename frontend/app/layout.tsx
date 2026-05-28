import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Receipt",
  description: "영수증 지출관리",
};

const navItems = [
  { href: "/", label: "홈" },
  { href: "/receipts", label: "영수증" },
  { href: "/receipts/new", label: "등록" },
  { href: "/categories", label: "카테고리" },
  { href: "/stats", label: "통계" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
            <span className="text-lg font-semibold">💸 Receipt</span>
            <ul className="flex gap-3 text-sm">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded px-2 py-1 text-slate-700 hover:bg-slate-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
