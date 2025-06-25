import { redirect } from 'next/navigation';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function AdminProductsAddPage() {
  // Redirect to default locale admin products add page
  redirect('/fa/admin/products/add');
} 