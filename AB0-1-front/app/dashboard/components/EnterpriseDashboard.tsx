'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye,
  Zap,
  MessageSquare,
  Target,
  Star,
  Award,
  Clock,
  TrendingUp
} from 'lucide-react';

// Layout Components
import EnterpriseSidebar from './EnterpriseSidebar';
import EnterpriseHeader from './EnterpriseHeader';
import { EnterpriseMetricsGrid } from './EnterpriseMetricCard';

// Feature Components
import CompanyInfo from './CompanyInfo';
import CategoriesManagement from './CategoriesManagement';
import BannersSponsorship from './BannersSponsorship';
import ProductsManagement from './ProductsManagement';
import ReviewsManagement from './ReviewsManagement';
import MediaGallery from './MediaGallery';
import LeadsOpportunities from './LeadsOpportunities';
import CampaignsMarketing from './CampaignsMarketing';
import CompanySettings from './CompanySettings';
import OverviewTab from './OverviewTab';

// New Modern Analytics Components
import ReviewsAnalytics from './ReviewsAnalytics';
import PerformanceMetrics from './PerformanceMetrics';
import CompetitorBenchmark from './CompetitorBenchmark';
import ThemeToggle from './ThemeToggle';
import AzureOverview from './AzureOverview';

interface CompanyDashboardProps {
  companyId: string;
}

interface DashboardStats {
  profileViews: number;
  ctaClicks: number;
  whatsappClicks: number;
  leadsReceived: number;
  reviewsCount: number;
  averageRating: number;
  pendingApprovals: number;
  activeCampaigns: number;
  conversionRate: number;
}

interface Notification {
  id: string;
  type: 'approval' | 'review' | 'lead' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export default function EnterpriseDashboard({ companyId }: CompanyDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Load theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('dashboard-theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    setThemeMode(initialTheme);
    
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    fetchCompanyData();
    fetchDashboardStats();
    fetchNotifications();
  }, [companyId]);

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setThemeMode(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const fetchCompanyData = async () => {
    try {
      // Mock data - replace with actual API call
      setCompany({
        id: companyId,
        name: 'Minha Empresa Premium',
        logo_url: '/placeholder-logo.jpg',
        verified: true,
        featured: true,
        city: 'São Paulo',
        state: 'SP'
      });
    } catch (error) {
      console.error('Error fetching company:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    // Mock data - replace with actual API call
    setStats({
      profileViews: 3847,
      ctaClicks: 487,
      whatsappClicks: 245,
      leadsReceived: 89,
      reviewsCount: 287,
      averageRating: 4.7,
      pendingApprovals: 3,
      activeCampaigns: 2,
      conversionRate: 12.7
    });
  };

  const fetchNotifications = async () => {
    // Mock notifications - replace with actual API call
    setNotifications([
      {
        id: '1',
        type: 'approval',
        title: 'Alteração Aprovada',
        message: 'Sua atualização de informações foi aprovada pelo admin.',
        timestamp: new Date(Date.now() - 3600000),
        read: false
      },
      {
        id: '2',
        type: 'review',
        title: 'Nova Avaliação',
        message: 'Você recebeu uma nova avaliação de 5 estrelas!',
        timestamp: new Date(Date.now() - 7200000),
        read: false
      },
      {
        id: '3',
        type: 'lead',
        title: 'Novo Lead',
        message: 'Um novo cliente em potencial entrou em contato.',
        timestamp: new Date(Date.now() - 86400000),
        read: true
      }
    ]);
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const metrics = [
    {
      title: 'Visualizações',
      value: stats?.profileViews || 0,
      icon: Eye,
      color: 'blue',
      change: '+23.5%',
      changeType: 'positive' as const,
      trend: [40, 55, 45, 70, 60, 85, 75]
    },
    {
      title: 'Cliques em CTAs',
      value: stats?.ctaClicks || 0,
      icon: Zap,
      color: 'purple',
      change: '+18.2%',
      changeType: 'positive' as const,
      trend: [30, 45, 60, 50, 65, 70, 80]
    },
    {
      title: 'WhatsApp',
      value: stats?.whatsappClicks || 0,
      icon: MessageSquare,
      color: 'green',
      change: '+15.7%',
      changeType: 'positive' as const,
      trend: [25, 35, 55, 45, 60, 75, 85]
    },
    {
      title: 'Leads',
      value: stats?.leadsReceived || 0,
      icon: Target,
      color: 'orange',
      change: '+23.1%',
      changeType: 'positive' as const,
      trend: [20, 40, 35, 50, 60, 70, 90]
    },
    {
      title: 'Avaliações',
      value: stats?.reviewsCount || 0,
      icon: Star,
      color: 'yellow',
      change: '+12.5%',
      changeType: 'positive' as const,
      trend: [50, 55, 50, 60, 65, 70, 75]
    },
    {
      title: 'Rating Médio',
      value: stats?.averageRating?.toFixed(1) || '0.0',
      icon: Award,
      color: 'pink',
      change: '+0.3',
      changeType: 'positive' as const,
      trend: [60, 65, 70, 75, 80, 85, 90]
    },
    {
      title: 'Pendentes',
      value: stats?.pendingApprovals || 0,
      icon: Clock,
      color: 'orange',
      change: '-2',
      changeType: stats?.pendingApprovals ? 'negative' : 'neutral' as const,
      trend: [80, 70, 60, 50, 40, 30, 20]
    },
    {
      title: 'Conversão',
      value: `${stats?.conversionRate || 0}%`,
      icon: TrendingUp,
      color: 'emerald',
      change: '+1.8%',
      changeType: 'positive' as const,
      trend: [30, 35, 40, 50, 55, 65, 72]
    }
  ];

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

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Drawer Sidebar */}
      <EnterpriseSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pendingCount={stats?.pendingApprovals || 0}
      />

      {/* Header */}
      <EnterpriseHeader
        company={company}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onMenuClick={() => setSidebarOpen(true)}
        themeToggle={<ThemeToggle onThemeChange={handleThemeChange} />}
      />

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <div className="max-w-[1600px] mx-auto p-4 lg:p-6">
          {/* Content based on active tab */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <AzureOverview 
                  metrics={metrics}
                  themeMode={themeMode}
                  companyId={companyId}
                  onNavigateToAnalytics={() => setActiveTab('analytics')}
                  onNavigateToBenchmark={() => setActiveTab('benchmark')}
                />
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      Analytics Avançado
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Métricas detalhadas de performance e engajamento
                    </p>
                  </div>
                  <PerformanceMetrics companyId={companyId} themeMode={themeMode} />
                </div>
              )}

              {activeTab === 'benchmark' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      Benchmark Competitivo
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Compare sua performance com os líderes da categoria
                    </p>
                  </div>
                  <CompetitorBenchmark companyId={companyId} themeMode={themeMode} />
                </div>
              )}

              {activeTab === 'info' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      Minha Empresa
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Gerencie as informações e dados da sua empresa
                    </p>
                  </div>
                  <CompanyInfo companyId={companyId} />
                </div>
              )}

              {activeTab === 'categories' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      Categorias
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Selecione as categorias onde sua empresa estará presente
                    </p>
                  </div>
                  <CategoriesManagement companyId={companyId} />
                </div>
              )}

              {activeTab === 'banners' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      Banners & Patrocínios
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Gerencie suas campanhas publicitárias e patrocínios
                    </p>
                  </div>
                  <BannersSponsorship companyId={companyId} />
                </div>
              )}

              {activeTab === 'products' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      Produtos & Serviços
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Gerencie seu catálogo de produtos e serviços
                    </p>
                  </div>
                  <ProductsManagement companyId={companyId} />
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      Avaliações
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Gerencie e responda às avaliações dos clientes
                    </p>
                  </div>
                  <ReviewsManagement companyId={companyId} />
                </div>
              )}

              {activeTab === 'media' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      Galeria de Mídia
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Gerencie fotos e vídeos da sua empresa
                    </p>
                  </div>
                  <MediaGallery companyId={companyId} />
                </div>
              )}

              {activeTab === 'leads' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      Oportunidades
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Gerencie seus leads e oportunidades de negócio
                    </p>
                  </div>
                  <LeadsOpportunities companyId={companyId} />
                </div>
              )}

              {activeTab === 'campaigns' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      Campanhas
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Acompanhe o desempenho das suas campanhas de marketing
                    </p>
                  </div>
                  <CampaignsMarketing companyId={companyId} />
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      Configurações
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Ajuste as configurações da sua conta
                    </p>
                  </div>
                  <CompanySettings companyId={companyId} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
