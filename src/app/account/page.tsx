import { redirect } from 'next/navigation';

export default function AccountPage() {
  // Redirect to default locale account page
  redirect('/fa/account');
} 