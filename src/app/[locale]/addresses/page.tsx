"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddressesRedirect({ params }: { params: { locale: string } }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/${params.locale}/account/addresses/`);
  }, [params.locale, router]);
  return null;
} 