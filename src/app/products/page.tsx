import { redirect } from 'next/navigation';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function ProductsPage() {
  // Redirect to default locale products page
  redirect('/fa/products');
} 