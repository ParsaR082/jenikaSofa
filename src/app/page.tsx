import { redirect } from 'next/navigation';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function RootPage() {
  // Redirect to default locale
  redirect('/fa');
} 