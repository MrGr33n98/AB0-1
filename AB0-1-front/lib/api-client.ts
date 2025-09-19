// =======================
// api-client.ts
// =======================

import axios from 'axios';
import { Category, Company, Review, Product } from './api';

// ------------------
// Configuração
// ------------------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Função auxiliar para montar query params
const buildQueryParams = (params: Record<string, any>) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  return queryParams.toString();
};

// ------------------
// Função genérica com fetch seguro (SSR friendly)
// ------------------
export async function fetchApiSafe<T>(
  endpoint: string,
  options: any = {}
): Promise<T> {
  const baseUrl = API_BASE_URL.replace(/\/+$/, '');
  const cleanEndpoint = endpoint.replace(/^\/+/, '').replace(/\/+$/, '');
  const url = `${baseUrl}/${cleanEndpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `Erro de API (${response.status})` }));
      throw new Error(`[${response.status}] ${errorData.error || 'Erro de API'} em ${url}`);
    }

    return response.json();
  } catch (error) {
    console.error(`❌ Falha ao acessar ${url}:`, error);
    throw error;
  }
}

// ------------------
// APIs Específicas
// ------------------

// Empresas
export const companiesApiSafe = {
  getAll: async (
    params?: { status?: string; featured?: boolean; category_id?: number; limit?: number }
  ): Promise<Company[]> => {
    const url = `companies?${buildQueryParams(params || {})}`;
    return fetchApiSafe<Company[]>(url);
  },

  // 🔥 Corrigido para desembrulhar o objeto { company: { ... } }
  getById: async (id: number): Promise<Company> => {
    const response = await fetchApiSafe<{ company: Company }>(`companies/${id}`);
    return response.company;
  },
};

// Categorias
export const categoriesApiSafe = {
  getAll: async (params?: { status?: string; featured?: boolean; limit?: number }): Promise<Category[]> => {
    const url = `categories?${buildQueryParams(params || {})}`;
    return fetchApiSafe<Category[]>(url);
  },
  getById: async (id: number): Promise<Category> => {
    return fetchApiSafe<Category>(`categories/${id}`);
  },
};

// Avaliações (Reviews)
export const reviewsApiSafe = {
  getAll: async (params?: { limit?: number }): Promise<Review[]> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    const url = `reviews?${queryParams.toString()}`;
    return fetchApiSafe<Review[]>(url);
  },
  getById: async (id: number): Promise<Review> => {
    return fetchApiSafe<Review>(`reviews/${id}`);
  },
};

// Produtos
export const productsApiSafe = {
  getAll: async (params?: { category_id?: number; company_id?: number; featured?: boolean; limit?: number }): Promise<Product[]> => {
    const queryParams = new URLSearchParams();
    if (params?.category_id) queryParams.append('category_id', params.category_id.toString());
    if (params?.company_id) queryParams.append('company_id', params.company_id.toString());
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    const url = `products?${queryParams.toString()}`;
    return fetchApiSafe<Product[]>(url);
  },
  getById: async (id: number): Promise<Product> => {
    return fetchApiSafe<Product>(`products/${id}`);
  },
};
