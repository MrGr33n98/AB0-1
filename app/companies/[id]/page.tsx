import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CompanyDetailClient from './CompanyDetailClient';
import { companiesApi } from '@/lib/api';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const company = await companiesApi.getById(parseInt(params.id));
    
    if (!company) {
      return {
        title: 'Empresa não encontrada | Compare Solar',
      };
    }

    return {
      title: `${company.name} | Compare Solar`,
      description: `${company.description} - Localizada em ${company.address}. Telefone: ${company.phone}`,
      keywords: `${company.name}, energia solar, painéis solares, instalação solar, ${company.address}`,
      openGraph: {
        title: `${company.name} - Empresa de Energia Solar`,
        description: `${company.description} - Localizada em ${company.address}. Telefone: ${company.phone}`,
        url: `https://www.comparesolar.com/companies/${company.id}`,
        type: 'website',
        siteName: 'Compare Solar',
        locale: 'pt_BR',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${company.name} | Compare Solar`,
        description: company.description,
      },
      alternates: {
        canonical: `https://www.comparesolar.com/companies/${company.id}`,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    return {
      title: 'Empresa não encontrada | Compare Solar',
    };
  }
}

export default async function CompanyDetailPage({ params }: Props) {
  try {
    const company = await companiesApi.getById(parseInt(params.id));
    
    if (!company) {
      notFound();
    }

    return <CompanyDetailClient company={company} />;
  } catch (error) {
    notFound();
  }
}