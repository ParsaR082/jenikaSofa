import { redirect } from 'next/navigation';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  // Redirect to default locale admin page
  redirect('/fa/admin');
} 