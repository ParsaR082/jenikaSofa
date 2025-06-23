import { redirect } from 'next/navigation';

export default function ProductsPage() {
  // Redirect to default locale products page
  redirect('/fa/products');
} 