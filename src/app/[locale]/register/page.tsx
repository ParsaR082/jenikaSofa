import { setRequestLocale } from 'next-intl/server';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-6 bg-card rounded-lg shadow-lg">
        <RegisterForm locale={params.locale} />
      </div>
    </div>
  );
} 