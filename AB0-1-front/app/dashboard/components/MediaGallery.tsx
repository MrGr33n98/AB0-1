'use client';

import { useState } from 'react';
import { ImageIcon, Plus, Upload, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MediaGalleryProps {
  companyId: string;
}

export default function MediaGallery({ companyId }: MediaGalleryProps) {
  const [photos, setPhotos] = useState([
    { id: '1', url: 'https://via.placeholder.com/400x300', title: 'Projeto 1' },
    { id: '2', url: 'https://via.placeholder.com/400x300', title: 'Projeto 2' },
    { id: '3', url: 'https://via.placeholder.com/400x300', title: 'Projeto 3' },
  ]);

  const handleUpload = () => {
    // Handle photo upload
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Galeria de Mídia</h2>
          <p className="text-muted-foreground">Gerencie fotos e mídia da empresa</p>
        </div>
        <Button onClick={handleUpload}>
          <Upload className="h-4 w-4 mr-2" />
          Upload de Fotos
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden group">
            <CardContent className="p-0 relative">
              <img 
                src={photo.url} 
                alt={photo.title}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="secondary" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {photos.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma foto adicionada</h3>
            <p className="text-muted-foreground text-center mb-4">
              Adicione fotos para mostrar seus projetos e instalações.
            </p>
            <Button onClick={handleUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload de Fotos
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
