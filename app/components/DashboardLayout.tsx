'use client';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r">
        <nav className="flex flex-col p-4 space-y-2">
          <Link href="/" className="p-2 rounded hover:bg-gray-100">Dashboard</Link>
          <Link href="/watchlist" className="p-2 rounded hover:bg-gray-100">Watchlists</Link>
          <Link href="/portfolio" className="p-2 rounded hover:bg-gray-100">Portfolio</Link>
          <Link href="/heatmap" className="p-2 rounded hover:bg-gray-100">Market Heatmap</Link>
          <Link href="/analytics" className="p-2 rounded hover:bg-gray-100">Analytics</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
