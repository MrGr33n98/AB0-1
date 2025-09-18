// app/companies/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CompanyDetailClient from './CompanyDetailClient';
import { companiesApiSafe } from '@/lib/api-client';

interface Props {
  params: { id: string }; // ✅ Corrigido: objeto direto, não Promise
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const company = await companiesApiSafe.getById(parseInt(params.id));

    if (!company) {
      return {
        title: 'Empresa não encontrada | Compare Solar',
      };
    }

    return {
      title: `${company.name} | Compare Solar`,
      description: `${company.description || ''} - Localizada em ${company.address || 'Endereço não informado'}. Telefone: ${company.phone || 'N/A'}`,
      openGraph: {
        title: `${company.name} - Empresa de Energia Solar`,
        description: `${company.description || ''} - Localizada em ${company.address || 'Endereço não informado'}. Telefone: ${company.phone || 'N/A'}`,
        url: `https://www.comparesolar.com/companies/${company.id}`,
        images: company.banner_url ? [{ url: company.banner_url }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${company.name} | Compare Solar`,
        description: company.description || '',
      },
      alternates: {
        canonical: `https://www.comparesolar.com/companies/${company.id}`,
      },
    };
  } catch (error) {
    console.error('Erro no generateMetadata:', error);
    return {
      title: 'Empresa não encontrada | Compare Solar',
    };
  }
}

export default async function CompanyDetailPage({ params }: Props) {
  try {
    const company = await companiesApiSafe.getById(parseInt(params.id));

    if (!company) {
      notFound();
    }

    return <CompanyDetailClient company={company} />;
  } catch (error) {
    console.error('Erro ao carregar company:', error);
    notFound();
  }
}
