// =======================
// api-client.ts
// =======================

import axios from 'axios';
import { Category, Company, Review, Product } from './api';

// ------------------
// Configuração
// ------------------
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1`;

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
  // Fix URL construction to prevent double slashes
  const baseUrl = API_BASE_URL.replace(/\/+$/, ''); // Remove trailing slashes
  const cleanEndpoint = endpoint.replace(/^\/+/, ''); // Remove leading slashes
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
    console.log('[API] Request ->', options.method || 'GET', url);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const responseBody = await response.json().catch(() => null);
    console.log('[API] Response data:', responseBody);

    if (!response.ok) {
      // Handle different error statuses gracefully
      if (response.status === 404) {
        console.log(`[404] Resource not found at ${url}`);
        // For 404s, we return a default empty value based on the expected type
        return undefined as any;
      }
      
      if (response.status >= 500) {
        console.error(`[500] Server error at ${url}`);
        // For server errors, we can show a toast or handle it gracefully
        throw new Error('Server error - please try again later');
      }
      
      const errorData = responseBody || { error: `API Error (${response.status})` };
      throw new Error(`[${response.status}] ${errorData.error || 'API Error'} at ${url}`);
    }

    return responseBody;
  } catch (error) {
    console.error(`❌ Failed to access ${url}:`, error);
    // Re-throw the error so calling functions can handle it appropriately
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
    try {
      const url = `companies?${buildQueryParams(params || {})}`;
      const response = await fetchApiSafe<any>(url); // Usar 'any' temporariamente para inspecionar a resposta
      
      // Verificar se a resposta é um array diretamente ou um objeto com a propriedade 'companies'
      if (Array.isArray(response)) {
        return response;
      } else if (response && Array.isArray(response.companies)) {
        return response.companies;
      }
      return [];
    } catch (error) {
      console.error('Error fetching companies:', error);
      // Return empty array on error to prevent breaking the UI
      return [];
    }
  },

  // 🔥 Corrigido para desembrulhar o objeto { company: { ... } }
  getById: async (id: number): Promise<Company | null> => {
    try {
      const response = await fetchApiSafe<Company>(`companies/${id}`);
      return response || null;
    } catch (error) {
      console.error(`Error fetching company with ID ${id}:`, error);
      // Return null on error to prevent breaking the UI
      return null;
    }
  },
};

// Categorias
export const categoriesApiSafe = {
  getAll: async (
    params?: { status?: string; featured?: boolean; category_id?: number; limit?: number; include_subcategories?: boolean }
  ): Promise<Category[]> => {
    try {
      const url = `categories?${buildQueryParams(params || {})}`;
      return await fetchApiSafe<Category[]>(url);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Return empty array on error to prevent breaking the UI
      return [];
    }
  },
  getById: async (id: number): Promise<Category | null> => {
    try {
      return await fetchApiSafe<Category>(`categories/${id}`);
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      // Return null on error to prevent breaking the UI
      return null;
    }
  },
  getBySlug: async (slug: string): Promise<Category | null> => {
    try {
      return await fetchApiSafe<Category>(`categories/by_slug/${slug}`);
    } catch (error) {
      console.error(`Error fetching category with slug ${slug}:`, error);
      // Return null on error to prevent breaking the UI
      return null;
    }
  },
};

// Avaliações (Reviews)
export const reviewsApiSafe = {
  getAll: async (params?: { limit?: number }): Promise<Review[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      const url = `reviews?${queryParams.toString()}`;
      return await fetchApiSafe<Review[]>(url);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Return empty array on error to prevent breaking the UI
      return [];
    }
  },
  getById: async (id: number): Promise<Review | null> => {
    try {
      return await fetchApiSafe<Review>(`reviews/${id}`);
    } catch (error) {
      console.error(`Error fetching review with ID ${id}:`, error);
      // Return null on error to prevent breaking the UI
      return null;
    }
  },
};

// Produtos
export const productsApiSafe = {
  getAll: async (params?: { category_id?: number; company_id?: number; featured?: boolean; limit?: number }): Promise<Product[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category_id) queryParams.append('category_id', params.category_id.toString());
      if (params?.company_id) queryParams.append('company_id', params.company_id.toString());
      if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      const url = `products?${queryParams.toString()}`;
      return await fetchApiSafe<Product[]>(url);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return empty array on error to prevent breaking the UI
      return [];
    }
  },
  getById: async (id: number): Promise<Product | null> => {
    try {
      return await fetchApiSafe<Product>(`products/${id}`);
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      // Return null on error to prevent breaking the UI
      return null;
    }
  },
};
