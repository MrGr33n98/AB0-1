import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CompanyDetailClient from './CompanyDetailClient';
import { companiesApi } from '@/lib/api';

interface Props {
  params: Promise<{ id: string }>; // ⬅️ agora params é uma Promise
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params; // ⬅️ await aqui
    const company = await companiesApi.getById(parseInt(id));

    if (!company) {
      return {
        title: 'Empresa não encontrada | Compare Solar',
      };
    }

    return {
      title: `${company.name} | Compare Solar`,
      description: `${company.description} - Localizada em ${company.address}. Telefone: ${company.phone}`,
      openGraph: {
        title: `${company.name} - Empresa de Energia Solar`,
        description: `${company.description} - Localizada em ${company.address}. Telefone: ${company.phone}`,
        url: `https://www.comparesolar.com/companies/${company.id}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${company.name} | Compare Solar`,
        description: company.description,
      },
      alternates: {
        canonical: `https://www.comparesolar.com/companies/${company.id}`,
      },
    };
  } catch {
    return {
      title: 'Empresa não encontrada | Compare Solar',
    };
  }
}

export default async function CompanyDetailPage({ params }: Props) {
  try {
    const { id } = await params; // ⬅️ await aqui também
    const company = await companiesApi.getById(parseInt(id));

    if (!company) {
      notFound();
    }

    return <CompanyDetailClient company={company} />;
  } catch {
    notFound();
  }
}
