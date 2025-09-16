// api-client.ts - Cliente seguro para API com suporte SSR
import { Category, Company } from './api';

// Configuração da URL base da API
// Garante que /api/v1 já venha do .env.local
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * Função genérica de fetch com tratamento de erros e suporte SSR.
 */
export async function fetchApiSafe<T>(
  endpoint: string,
  options: any = {}
): Promise<T> {
  // Remove barra inicial para evitar duplicação
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  // Monta a URL final
  const url = `${API_BASE_URL}/${cleanEndpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Adiciona token de autenticação no browser
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error (${response.status})`);
    }

    return response.json();
  } catch (error) {
    console.error(`❌ Falha ao acessar ${url}:`, error);
    throw error;
  }
}

//
// ------------------ APIs ESPECÍFICAS ------------------
//

// Empresas
export const companiesApiSafe = {
  getAll: async (): Promise<Company[]> => {
    return fetchApiSafe<Company[]>('companies');
  },
  getById: async (id: number): Promise<Company> => {
    return fetchApiSafe<Company>(`companies/${id}`);
  },
  create: async (
    payload: Omit<Company, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Company> => {
    return fetchApiSafe<Company>('companies', {
      method: 'POST',
      body: JSON.stringify({ company: payload }),
    });
  },
  update: async (id: number, payload: Partial<Company>): Promise<Company> => {
    return fetchApiSafe<Company>(`companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ company: payload }),
    });
  },
  delete: async (id: number): Promise<void> => {
    return fetchApiSafe<void>(`companies/${id}`, { method: 'DELETE' });
  },
};

// Categorias
export const categoriesApiSafe = {
  getAll: async (): Promise<Category[]> => {
    return fetchApiSafe<Category[]>('categories');
  },
  getById: async (id: number): Promise<Category> => {
    return fetchApiSafe<Category>(`categories/${id}`);
  },
};

//
// ⚡️ Aqui você pode expandir para outras entidades:
// - productsApiSafe
// - reviewsApiSafe
// - leadsApiSafe
// - etc.
//
