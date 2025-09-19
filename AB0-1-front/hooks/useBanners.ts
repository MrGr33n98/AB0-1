'use client';

import { useEffect, useState } from 'react';

interface Banner {
  id: number;
  image_url: string;
  link?: string;
  title?: string;
}

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBanners() {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3001/api/v1/banners');
        if (!res.ok) throw new Error(`Erro: ${res.status}`);
        const data = await res.json();
        setBanners(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBanners();
  }, []);

  return { banners, loading, error };
}
