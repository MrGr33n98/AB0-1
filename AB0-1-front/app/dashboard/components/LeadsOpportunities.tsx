'use client';

import { useState } from 'react';
import { Target, Mail, Phone, MessageSquare, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LeadsOpportunitiesProps {
  companyId: string;
}

export default function LeadsOpportunities({ companyId }: LeadsOpportunitiesProps) {
  const [leads] = useState([
    { 
      id: '1', 
      name: 'João Silva', 
      email: 'joao@email.com', 
      phone: '(11) 98765-4321',
      message: 'Gostaria de um orçamento para reforma',
      status: 'new',
      created_at: new Date()
    },
    { 
      id: '2', 
      name: 'Maria Santos', 
      email: 'maria@email.com', 
      phone: '(11) 97654-3210',
      message: 'Interessada em projeto de arquitetura',
      status: 'contacted',
      created_at: new Date(Date.now() - 86400000)
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Leads e Oportunidades</h2>
          <p className="text-muted-foreground">Gerencie contatos e oportunidades de negócio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Novos', count: 12, color: 'bg-blue-500' },
          { label: 'Contatados', count: 8, color: 'bg-green-500' },
          { label: 'Em Negociação', count: 5, color: 'bg-yellow-500' },
          { label: 'Convertidos', count: 15, color: 'bg-purple-500' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className={`w-3 h-3 rounded-full ${stat.color} mb-2`}></div>
              <p className="text-2xl font-bold">{stat.count}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {leads.map((lead) => (
          <Card key={lead.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{lead.name}</h3>
                    <Badge variant={lead.status === 'new' ? 'default' : 'secondary'}>
                      {lead.status === 'new' ? 'Novo' : 'Contatado'}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {lead.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {lead.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {lead.created_at.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <p className="text-sm mt-3 p-3 bg-muted rounded-lg">{lead.message}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Ligar
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar E-mail
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {leads.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum lead recebido</h3>
            <p className="text-muted-foreground text-center">
              Quando clientes entrarem em contato, os leads aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
