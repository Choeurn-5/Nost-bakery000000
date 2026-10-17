import { redirect } from "next/navigation";

interface CafePageProps {
  params: Promise<{ locale: string }>;
}

export default async function CafePage({ params }: CafePageProps) {
  const { locale } = await params;
  redirect(`/${locale}/menu`);
}
