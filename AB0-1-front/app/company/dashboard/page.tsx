'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MessageCircle, 
  Settings, 
  CreditCard,
  BarChart3,
  Mail,
  Phone,
  MessageSquare,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { useCompanyPermissions } from '@/hooks/useCompanyPermissions';
import CompanyDashboard from '@/components/CompanyDashboard';
import OpportunityManager from '@/components/OpportunityManager';
import CompanyProfileEditor from '@/components/CompanyProfileEditor';

import { Sidebar } from '@/components/ui/sidebar';

interface CompanySidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

function CompanySidebar({ activeView, setActiveView }: CompanySidebarProps) {
  const { permissions } = useCompanyPermissions();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'opportunities', label: 'Oportunidades', icon: Users },
    { id: 'leads', label: 'Leads', icon: MessageCircle },
    { 
      id: 'profile', 
      label: 'Editar Perfil', 
      icon: Settings,
      disabled: !permissions.canEditProfile
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3,
      disabled: !permissions.isPremium
    },
  ];

  return (
    <aside className="w-64 bg-muted/40 p-4 h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Painel da Empresa</h2>
        <p className="text-sm text-muted-foreground">Gerencie seu negócio</p>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeView === item.id ? "secondary" : "ghost"}
            className={`w-full justify-start ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !item.disabled && setActiveView(item.id)}
            disabled={item.disabled}
          >
            <item.icon className="h-4 w-4 mr-2" />
            {item.label}
          </Button>
        ))}
      </nav>
      
      {permissions.isPremium && (
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
          <h3 className="font-semibold">Plano Premium Ativo</h3>
          <p className="text-sm opacity-90 mt-1">Aproveite todos os recursos exclusivos</p>
          <Button variant="secondary" size="sm" className="mt-3 w-full">
            Gerenciar Plano
          </Button>
        </div>
      )}
    </aside>
  );
}

export default function CompanyDashboardPage() {
  const [activeView, setActiveView] = useState('dashboard');
  const { permissions, loading } = useCompanyPermissions();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <CompanySidebar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 overflow-auto">
        <header className="bg-background py-4 px-6 border-b">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Início</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard Empresarial</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        
        <div className="p-6">
          {activeView === 'dashboard' && <CompanyDashboard />}
          {activeView === 'opportunities' && <OpportunityManager />}
          {activeView === 'leads' && <OpportunityManager />} {/* Leads são gerenciados na oportunidade */}
          {activeView === 'profile' && (
            <CompanyProfileEditor 
              initialData={{ 
                name: 'Sua Empresa', 
                description: 'Descrição da sua empresa',
                whatsapp: '5511999999999',
                // Mais dados iniciais conforme necessário
              }} 
              onSave={(data) => console.log('Salvando dados:', data)} 
            />
          )}
          {activeView === 'analytics' && permissions.isPremium && (
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">Analytics Avançados</h1>
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios e Análises</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Acesso a relatórios detalhados de desempenho, conversão e tendências.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <BarChart3 className="h-12 w-12 mx-auto text-blue-500" />
                        <h3 className="font-semibold mt-2">Funil de Conversão</h3>
                        <p className="text-sm text-muted-foreground mt-1">Acompanhe a jornada dos leads</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto text-green-500" />
                        <h3 className="font-semibold mt-2">Tempo de Resposta</h3>
                        <p className="text-sm text-muted-foreground mt-1">Analise sua agilidade</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Eye className="h-12 w-12 mx-auto text-purple-500" />
                        <h3 className="font-semibold mt-2">Tráfego de Página</h3>
                        <p className="text-sm text-muted-foreground mt-1">Veja quem visita seu perfil</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}