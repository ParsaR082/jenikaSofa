import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/fa');
  return null;
} 