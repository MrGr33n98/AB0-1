'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Eye,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCompanyPermissions } from '@/hooks/useCompanyPermissions';
import { useCompanyLeads } from '@/hooks/useCompanyLeads';

// Componente para visualizar leads
const LeadCard = ({ lead, onUpdateStatus }: { lead: any; onUpdateStatus: (id: number, status: string) => void }) => {
  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-purple-100 text-purple-800',
    converted: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{lead.name}</h3>
          <p className="text-sm text-muted-foreground">{lead.company_name}</p>
        </div>
        <Badge className={statusColors[lead.status as keyof typeof statusColors]}>
          {lead.status}
        </Badge>
      </div>
      
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{lead.email}</span>
        </div>
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{lead.phone}</span>
        </div>
        {lead.location && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{lead.location}</span>
          </div>
        )}
        {lead.message && (
          <p className="mt-2 text-muted-foreground line-clamp-2">{lead.message}</p>
        )}
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {new Date(lead.created_at).toLocaleDateString()}
        </span>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onUpdateStatus(lead.id, 'contacted')}
          >
            Contatado
          </Button>
          <Button 
            size="sm"
            onClick={() => onUpdateStatus(lead.id, 'qualified')}
          >
            Qualificado
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Componente de estatísticas
const StatsCard = ({ title, value, icon: Icon, change, color = "blue" }: { 
  title: string; 
  value: string | number; 
  icon: any; 
  change?: string; 
  color?: string;
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
  };
  
  const bgColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {change && (
              <p className="text-sm mt-1 text-green-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${bgColor}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CompanyDashboard() {
  const { permissions, loading: permissionsLoading } = useCompanyPermissions();
  const [activeTab, setActiveTab] = useState('leads');
  const { leads, loading: leadsLoading, updateLeadStatus } = useCompanyLeads({ 
    companyId: 1, // Isso deve vir do contexto ou do usuário autenticado
    status: undefined 
  });
  
  // Simular dados de estatísticas
  const stats = [
    { title: "Leads Recebidos", value: leads.length, icon: Users, change: "+12%", color: "blue" },
    { title: "Leads Qualificados", value: leads.filter(l => l.status === 'qualified').length, icon: CheckCircle, change: "+8%", color: "green" },
    { title: "Conversões", value: leads.filter(l => l.status === 'converted').length, icon: DollarSign, change: "+5%", color: "purple" },
    { title: "Taxa de Resposta", value: "78%", icon: MessageCircle, change: "+3%", color: "yellow" },
  ];

  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  if (!permissions.canAccessLeads) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Acesso ao Dashboard</h2>
            <p className="text-muted-foreground mb-6">
              {permissions.isPremium 
                ? "Seu plano atual não permite acesso a esta funcionalidade." 
                : "Atualize seu plano para acessar os leads e recursos avançados."}
            </p>
            <Button>Ver Planos Disponíveis</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard da Empresa</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie seus leads e acompanhe o desempenho da sua empresa
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard 
              title={stat.title} 
              value={stat.value} 
              icon={stat.icon} 
              change={stat.change} 
              color={stat.color} 
            />
          </motion.div>
        ))}
      </div>

      {/* Tabs para diferentes seções */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leads">Todos os Leads</TabsTrigger>
          <TabsTrigger value="new">Novos</TabsTrigger>
          <TabsTrigger value="qualified">Qualificados</TabsTrigger>
          <TabsTrigger value="converted">Convertidos</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Todos os Leads</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Filtrar</Button>
              <Button size="sm">Exportar</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map(lead => (
              <LeadCard 
                key={lead.id} 
                lead={lead} 
                onUpdateStatus={updateLeadStatus} 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <h2 className="text-xl font-semibold">Novos Leads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.filter(l => l.status === 'new').map(lead => (
              <LeadCard 
                key={lead.id} 
                lead={lead} 
                onUpdateStatus={updateLeadStatus} 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="qualified" className="space-y-4">
          <h2 className="text-xl font-semibold">Leads Qualificados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.filter(l => l.status === 'qualified').map(lead => (
              <LeadCard 
                key={lead.id} 
                lead={lead} 
                onUpdateStatus={updateLeadStatus} 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="converted" className="space-y-4">
          <h2 className="text-xl font-semibold">Leads Convertidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.filter(l => l.status === 'converted').map(lead => (
              <LeadCard 
                key={lead.id} 
                lead={lead} 
                onUpdateStatus={updateLeadStatus} 
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {leads.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-xl font-semibold mt-4">Nenhum lead ainda</h3>
            <p className="text-muted-foreground mt-2">
              Seus leads aparecerão aqui quando os clientes solicitarem orçamentos
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}