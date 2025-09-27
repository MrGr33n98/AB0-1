'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCompanyPermissions } from '@/hooks/useCompanyPermissions';
import { MessageCircle, Send, Smartphone, Settings, Globe } from 'lucide-react';

interface WhatsAppContactProps {
  lead?: {
    name: string;
    phone: string;
    email: string;
    message: string;
    company_name?: string;
  };
  companyId?: number;
}

export default function WhatsAppContact({ lead, companyId }: WhatsAppContactProps) {
  const { permissions } = useCompanyPermissions();
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [message, setMessage] = useState('');
  const [useTemplate, setUseTemplate] = useState(true);
  
  // Carregar número do WhatsApp da empresa (isso viria do contexto ou API)
  useEffect(() => {
    // Em uma implementação real, buscar o número do WhatsApp da empresa
    setWhatsappNumber('5511999999999'); // Exemplo
  }, [companyId]);

  const generateWhatsAppLink = () => {
    let text = message;
    
    // Se estiver usando template e houver lead, adicionar informações do lead
    if (useTemplate && lead) {
      const leadInfo = `\n\n*Novo Lead:*\nNome: ${lead.name}\nEmail: ${lead.email}\nTelefone: ${lead.phone}`;
      if (lead.company_name) text += `\nEmpresa: ${lead.company_name}`;
      text += leadInfo;
      text += `\nMensagem: ${lead.message}`;
    }
    
    // Codificar mensagem para URL
    const encodedMessage = encodeURIComponent(text);
    return `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodedMessage}`;
  };

  const handleSendMessage = () => {
    const link = generateWhatsAppLink();
    window.open(link, '_blank');
  };

  // Verificar se o usuário tem permissão para usar o WhatsApp
  if (!permissions.canUseWhatsApp) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <Smartphone className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold mt-4">Integração com WhatsApp</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            {permissions.isPremium 
              ? "Seu plano atual não permite acesso a esta funcionalidade." 
              : "Atualize para um plano premium para desbloquear a integração com WhatsApp."}
          </p>
          <Button>Ver Planos Disponíveis</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <CardTitle>Contato via WhatsApp</CardTitle>
        </div>
        <CardDescription>
          Envie mensagens diretamente para o WhatsApp da sua empresa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="whatsapp-number">Número do WhatsApp</Label>
          <Input
            id="whatsapp-number"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="Ex: 5511999999999"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="use-template" 
            checked={useTemplate}
            onChange={(e) => setUseTemplate(e.target.checked)}
            className="h-4 w-4"
          />
          <Label htmlFor="use-template">Usar template com informações do lead</Label>
        </div>
        
        <div>
          <Label htmlFor="message">Mensagem</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem aqui..."
            rows={4}
            className="mt-1"
          />
        </div>
        
        <Button 
          onClick={handleSendMessage}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Send className="h-4 w-4 mr-2" />
          Enviar via WhatsApp
        </Button>
        
        {lead && useTemplate && (
          <div className="p-3 bg-muted rounded-md">
            <h4 className="font-medium mb-2">Prévia da mensagem:</h4>
            <p className="text-sm whitespace-pre-line">
              {message}
              
              *Novo Lead:*
              Nome: {lead.name}
              Email: {lead.email}
              Telefone: {lead.phone}
              {lead.company_name && `Empresa: ${lead.company_name}`}
              Mensagem: {lead.message}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Componente para exibir botões de CTAs personalizados
export function CompanyCTAs({ company }: { company: any }) {
  const { permissions } = useCompanyPermissions();
  
  if (!permissions.canUseCustomCTAs) return null;
  
  const primaryCTA = company?.cta_primary_label && company?.cta_primary_url;
  const secondaryCTA = company?.cta_secondary_label && company?.cta_secondary_url;
  
  if (!primaryCTA && !secondaryCTA) return null;
  
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {primaryCTA && (
        <Button asChild>
          <a 
            href={company.cta_primary_url} 
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {company.cta_primary_label}
          </a>
        </Button>
      )}
      
      {secondaryCTA && (
        <Button variant="outline" asChild>
          <a 
            href={company.cta_secondary_url} 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe className="h-4 w-4 mr-2" />
            {company.cta_secondary_label}
          </a>
        </Button>
      )}
    </div>
  );
}