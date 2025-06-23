import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redirect to default locale admin page
  redirect('/fa/admin');
} 