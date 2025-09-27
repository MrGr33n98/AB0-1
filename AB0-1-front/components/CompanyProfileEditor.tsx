'use client';

import { useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCompanyPermissions } from '@/hooks/useCompanyPermissions';
import { UploadIcon, Camera, Save, X, Settings, Image as ImageIcon } from 'lucide-react';

// Schema para validação do formulário
const companyProfileSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  description: z.string().min(10, { message: "Descrição deve ter pelo menos 10 caracteres" }),
  website: z.string().url({ message: "URL inválida" }).optional().or(z.literal('')),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  email_public: z.string().email({ message: "Email inválido" }).optional().or(z.literal('')),
  whatsapp: z.string().min(10, { message: "Número do WhatsApp inválido" }),
  business_hours: z.string().optional(),
  address: z.string().min(5, { message: "Endereço deve ter pelo menos 5 caracteres" }),
  city: z.string().min(2, { message: "Cidade deve ter pelo menos 2 caracteres" }),
  state: z.string().min(2, { message: "Estado deve ter pelo menos 2 caracteres" }),
  // Campos específicos para empresas premium
  cta_primary_label: z.string().optional(),
  cta_primary_url: z.string().url({ message: "URL do CTA inválida" }).optional().or(z.literal('')),
  cta_secondary_label: z.string().optional(),
  cta_secondary_url: z.string().url({ message: "URL do CTA secundário inválida" }).optional().or(z.literal('')),
});

type CompanyProfileForm = z.infer<typeof companyProfileSchema>;

interface CompanyProfileEditorProps {
  initialData?: any;
  onSave: (data: any) => void;
}

export default function CompanyProfileEditor({ initialData, onSave }: CompanyProfileEditorProps) {
  const { permissions } = useCompanyPermissions();
  const [isSaving, setIsSaving] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(initialData?.banner_url || null);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo_url || null);
  
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CompanyProfileForm>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      website: initialData?.website || '',
      phone: initialData?.phone || '',
      email_public: initialData?.email_public || '',
      whatsapp: initialData?.whatsapp || '',
      business_hours: initialData?.business_hours || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      cta_primary_label: initialData?.cta_primary_label || '',
      cta_primary_url: initialData?.cta_primary_url || '',
      cta_secondary_label: initialData?.cta_secondary_label || '',
      cta_secondary_url: initialData?.cta_secondary_url || '',
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'banner') {
          setBannerPreview(reader.result as string);
        } else {
          setLogoPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CompanyProfileForm) => {
    setIsSaving(true);
    try {
      // Preparar dados para envio, incluindo imagens se forem novas
      const formData = new FormData();
      
      // Campos básicos
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(`company[${key}]`, value);
      });

      // Imagens
      if (bannerInputRef.current?.files?.[0]) {
        formData.append('company[banner]', bannerInputRef.current.files[0]);
      }
      if (logoInputRef.current?.files?.[0]) {
        formData.append('company[logo]', logoInputRef.current.files[0]);
      }

      await onSave(formData);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Verificar se o usuário tem permissão para editar
  if (!permissions.canEditProfile) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <Settings className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold mt-4">Edição de Perfil</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            {permissions.isPremium 
              ? "Seu plano atual não permite edição de perfil avançado." 
              : "Atualize para um plano premium para desbloquear a edição de perfil completo."}
          </p>
          <Button>Ver Planos Disponíveis</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Editar Perfil da Empresa</h1>
        <p className="text-muted-foreground">
          Atualize as informações da sua empresa e personalize sua página
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-1/2">
              <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
              <TabsTrigger value="images">Imagens</TabsTrigger>
              {permissions.canUseCustomCTAs && (
                <TabsTrigger value="cta">Botões de Ação</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>
                    Atualize os dados principais da sua empresa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Empresa *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da sua empresa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva sua empresa, serviços e diferenciais"
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://suaempresa.com.br" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email_public"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email de Contato</FormLabel>
                          <FormControl>
                            <Input placeholder="contato@suaempresa.com.br" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone *</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp *</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="business_hours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário de Funcionamento</FormLabel>
                          <FormControl>
                            <Input placeholder="Seg-Sex: 8h-18h" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço *</FormLabel>
                          <FormControl>
                            <Input placeholder="Rua, número, bairro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade *</FormLabel>
                          <FormControl>
                            <Input placeholder="São Paulo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado *</FormLabel>
                          <FormControl>
                            <Input placeholder="SP" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Imagens do Perfil</CardTitle>
                  <CardDescription>
                    Atualize o banner e logo da sua empresa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Banner Upload */}
                  <div className="space-y-2">
                    <Label>Banner da Empresa</Label>
                    <div className="flex items-center space-x-4">
                      {bannerPreview ? (
                        <div className="relative">
                          <img 
                            src={bannerPreview} 
                            alt="Pré-visualização do banner" 
                            className="w-64 h-32 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={() => {
                              setBannerPreview(null);
                              if (bannerInputRef.current) bannerInputRef.current.value = '';
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg w-64 h-32 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex flex-col space-y-2">
                        <Input
                          type="file"
                          ref={bannerInputRef}
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'banner')}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => bannerInputRef.current?.click()}
                        >
                          <UploadIcon className="h-4 w-4 mr-2" />
                          {bannerPreview ? "Trocar Banner" : "Adicionar Banner"}
                        </Button>
                        <p className="text-sm text-muted-foreground">
                          Dimensões recomendadas: 1200x300px
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <Label>Logo da Empresa</Label>
                    <div className="flex items-center space-x-4">
                      {logoPreview ? (
                        <div className="relative">
                          <img 
                            src={logoPreview} 
                            alt="Pré-visualização do logo" 
                            className="w-32 h-32 object-contain rounded-lg border"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={() => {
                              setLogoPreview(null);
                              if (logoInputRef.current) logoInputRef.current.value = '';
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg w-32 h-32 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex flex-col space-y-2">
                        <Input
                          type="file"
                          ref={logoInputRef}
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'logo')}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => logoInputRef.current?.click()}
                        >
                          <UploadIcon className="h-4 w-4 mr-2" />
                          {logoPreview ? "Trocar Logo" : "Adicionar Logo"}
                        </Button>
                        <p className="text-sm text-muted-foreground">
                          Dimensões recomendadas: 300x300px (quadrado)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {permissions.canUseCustomCTAs && (
              <TabsContent value="cta" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Botões de Ação Personalizados</CardTitle>
                    <CardDescription>
                      Configure botões de ação para direcionar clientes para WhatsApp, orçamentos, etc.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="cta_primary_label"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Texto do Botão Principal</FormLabel>
                            <FormControl>
                              <Input placeholder="Solicitar Orçamento" {...field} />
                            </FormControl>
                            <FormDescription>
                              Texto exibido no botão principal da sua página
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cta_primary_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Link do Botão Principal</FormLabel>
                            <FormControl>
                              <Input placeholder="https://wa.me/5511999999999" {...field} />
                            </FormControl>
                            <FormDescription>
                              Link para onde o botão principal direciona
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cta_secondary_label"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Texto do Botão Secundário</FormLabel>
                            <FormControl>
                              <Input placeholder="Ver Projetos" {...field} />
                            </FormControl>
                            <FormDescription>
                              Texto exibido no botão secundário
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cta_secondary_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Link do Botão Secundário</FormLabel>
                            <FormControl>
                              <Input placeholder="https://suaempresa.com.br/projetos" {...field} />
                            </FormControl>
                            <FormDescription>
                              Link para onde o botão secundário direciona
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">Cancelar</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="mr-2">Salvando...</span>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}