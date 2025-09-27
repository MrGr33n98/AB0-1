'use client';

import { useState, useEffect } from 'react';
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
  Clock,
  Filter,
  Download,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useCompanyPermissions } from '@/hooks/useCompanyPermissions';
import { useCompanyLeads } from '@/hooks/useCompanyLeads';

// Componente para visualizar oportunidades
const OpportunityCard = ({ 
  opportunity, 
  onUpdateStatus 
}: { 
  opportunity: any; 
  onUpdateStatus: (id: number, status: string) => void 
}) => {
  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-purple-100 text-purple-800',
    converted: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800',
  };

  const statusIcons = {
    new: Clock,
    contacted: MessageCircle,
    qualified: CheckCircle,
    converted: DollarSign,
    lost: XCircle,
  };

  const StatusIcon = statusIcons[opportunity.status as keyof typeof statusIcons] || Clock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{opportunity.name}</h3>
            {opportunity.company_name && (
              <span className="text-sm text-muted-foreground">({opportunity.company_name})</span>
            )}
          </div>
          {opportunity.project_type && (
            <p className="text-sm text-muted-foreground">{opportunity.project_type}</p>
          )}
        </div>
        <Badge className={statusColors[opportunity.status as keyof typeof statusColors]}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {opportunity.status}
        </Badge>
      </div>
      
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{opportunity.email}</span>
        </div>
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{opportunity.phone}</span>
        </div>
        {opportunity.location && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{opportunity.location}</span>
          </div>
        )}
        {opportunity.budget_range && (
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{opportunity.budget_range}</span>
          </div>
        )}
        {opportunity.timeline && (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{opportunity.timeline}</span>
          </div>
        )}
        {opportunity.message && (
          <p className="mt-2 text-muted-foreground line-clamp-2">{opportunity.message}</p>
        )}
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {new Date(opportunity.created_at).toLocaleDateString('pt-BR')}
        </span>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onUpdateStatus(opportunity.id, 'contacted')}
          >
            Contatar
          </Button>
          <Button 
            size="sm"
            onClick={() => onUpdateStatus(opportunity.id, 'qualified')}
          >
            Qualificar
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Componente de estatísticas de oportunidades
const OpportunityStats = ({ opportunities }: { opportunities: any[] }) => {
  const stats = [
    { 
      title: "Oportunidades", 
      value: opportunities.length, 
      icon: Users, 
      color: "blue" 
    },
    { 
      title: "Em Andamento", 
      value: opportunities.filter(o => ['new', 'contacted', 'qualified'].includes(o.status)).length, 
      icon: TrendingUp, 
      color: "purple" 
    },
    { 
      title: "Convertidas", 
      value: opportunities.filter(o => o.status === 'converted').length, 
      icon: DollarSign, 
      color: "green" 
    },
    { 
      title: "Taxa de Conversão", 
      value: opportunities.length ? `${Math.round((opportunities.filter(o => o.status === 'converted').length / opportunities.length) * 100)}%` : '0%', 
      icon: TrendingUp, 
      color: "yellow" 
    },
  ];
  
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-full ${colorClasses[stat.color as keyof typeof colorClasses] || colorClasses.blue}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

interface OpportunityManagerProps {
  companyId?: number;
}

export default function OpportunityManager({ companyId = 1 }: OpportunityManagerProps) {
  const { permissions, loading: permissionsLoading } = useCompanyPermissions();
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    leads: opportunities, 
    loading, 
    updateLeadStatus 
  } = useCompanyLeads({ 
    companyId: companyId, 
    status: statusFilter as any 
  });
  
  // Se não tiver permissão, mostrar mensagem
  if (!permissions.canAccessLeads) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold mt-4">Acesso às Oportunidades</h2>
            <p className="text-muted-foreground mt-2 mb-6">
              {permissions.isPremium 
                ? "Seu plano atual não permite acesso a esta funcionalidade." 
                : "Atualize seu plano para acessar as oportunidades e recursos avançados."}
            </p>
            <Button>Ver Planos Disponíveis</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filtrar oportunidades com base na pesquisa
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = searchQuery === '' || 
      opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opp.company_name && opp.company_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  // Agrupar oportunidades por status
  const opportunitiesByStatus = {
    all: filteredOpportunities,
    new: filteredOpportunities.filter(o => o.status === 'new'),
    contacted: filteredOpportunities.filter(o => o.status === 'contacted'),
    qualified: filteredOpportunities.filter(o => o.status === 'qualified'),
    converted: filteredOpportunities.filter(o => o.status === 'converted'),
    lost: filteredOpportunities.filter(o => o.status === 'lost'),
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestão de Oportunidades</h1>
        <p className="text-muted-foreground mt-2">
          Acompanhe e gerencie todas as oportunidades de negócio
        </p>
      </div>

      {/* Estatísticas */}
      <OpportunityStats opportunities={opportunities} />

      {/* Filtros e busca */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar oportunidades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || undefined)}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os status</SelectItem>
            <SelectItem value="new">Novo</SelectItem>
            <SelectItem value="contacted">Contatado</SelectItem>
            <SelectItem value="qualified">Qualificado</SelectItem>
            <SelectItem value="converted">Convertido</SelectItem>
            <SelectItem value="lost">Perdido</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Lista de oportunidades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de oportunidades */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Oportunidades</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Carregando oportunidades...</p>
                </div>
              ) : filteredOpportunities.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-xl font-semibold mt-4">Nenhuma oportunidade encontrada</h3>
                  <p className="text-muted-foreground mt-2">
                    {searchQuery ? 'Sua busca não encontrou resultados' : 'Adicione filtros para encontrar oportunidades'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredOpportunities.map(opp => (
                    <OpportunityCard 
                      key={opp.id} 
                      opportunity={opp} 
                      onUpdateStatus={updateLeadStatus} 
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Painel de status */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumo por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(opportunitiesByStatus).map(([status, list]) => (
                  <div 
                    key={status} 
                    className={`flex justify-between items-center p-3 rounded-lg cursor-pointer ${
                      activeTab === status ? 'bg-muted' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => {
                      setActiveTab(status);
                      setStatusFilter(status === 'all' ? undefined : status);
                    }}
                  >
                    <span className="capitalize">
                      {status === 'all' ? 'Todas' : 
                       status === 'new' ? 'Novas' : 
                       status === 'contacted' ? 'Contatadas' : 
                       status === 'qualified' ? 'Qualificadas' : 
                       status === 'converted' ? 'Convertidas' : 
                       'Perdidas'}
                    </span>
                    <Badge variant="secondary">{list.length}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mt-0.5 mr-2 text-green-500 flex-shrink-0" />
                  <span>Contatar leads novos em até 24h</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mt-0.5 mr-2 text-green-500 flex-shrink-0" />
                  <span>Qualificar leads em até 3 dias</span>
                </li>
                <li className="flex items-start">
                  <Clock className="h-4 w-4 mt-0.5 mr-2 text-yellow-500 flex-shrink-0" />
                  <span>Revisar leads antigos sem interação</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}