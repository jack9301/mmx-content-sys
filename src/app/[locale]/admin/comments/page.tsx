import dynamic from 'next/dynamic';

// Admin is fully client-side; on static hosts it uses localStorage as a mock backend.
// On Cloudflare Pages (serverless), it uses /api/comments/admin.
const AdminClient = dynamic(() => import('@/components/admin-panel').then((m) => m.AdminPanel), {
  ssr: false,
  loading: () => <div className="p-10 text-center text-sm text-neutral-500">Loading admin…</div>,
});

export default function AdminPage() {
  return <AdminClient />;
}