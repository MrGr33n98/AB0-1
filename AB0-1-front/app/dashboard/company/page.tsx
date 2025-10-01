'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EnterpriseDashboard from '../components/EnterpriseDashboard';

export default function CompanyDashboardPage() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, use a mock company ID
    // In production, this would check authentication and get the user's company
    const mockCompanyId = '1';
    setCompanyId(mockCompanyId);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!companyId) {
    return null;
  }

  return <EnterpriseDashboard companyId={companyId} />;
}
