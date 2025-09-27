// =======================
// Imports
// =======================
import axios from 'axios';

// =======================
// API Response Types
// =======================
export interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  name: string;
  description: string;         // Corrigido de 'about' para 'description'
  highlights?: string;
  website: string;
  phone: string;
  address: string;
  state?: string;
  city?: string;
  created_at: string;
  updated_at: string;
  banner_url?: string | null;
  logo_url?: string | null;
  rating?: number;
  total_reviews?: number;
  business_hours?: string;
  payment_methods?: string[];
  category_name?: string;
  category_id?: number;
  status?: 'active' | 'inactive';
  featured?: boolean;
  founded_year?: number;
  employees_count?: number;
  rating_avg?: number;
  rating_count?: number;
  certifications?: string;
  awards?: string;
  partner_brands?: string;
  coverage_states?: string;
  coverage_cities?: string;
  latitude?: number;
  longitude?: number;
  minimum_ticket?: number;
  maximum_ticket?: number;
  financing_options?: string;
  response_time_sla?: string;
  languages?: string;
  email_public?: string;
  whatsapp?: string;
  phone_alt?: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  media_gallery?: string;
  cta_primary_label?: string;
  cta_primary_type?: string;
  cta_primary_url?: string;
  cta_secondary_label?: string;
  cta_secondary_type?: string;
  cta_secondary_url?: string;
  cta_whatsapp_template?: string;
  cta_utm_source?: string;
  cta_utm_medium?: string;
  cta_utm_campaign?: string;
  ctas_json?: Record<string, any>;
  // Campos relacionados ao plano
  plan_id?: number;
  plan_name?: string;
  plan_features?: string[];
  plan_expires_at?: string;
  // Campos de perfis
  profile_complete?: boolean;
  verified?: boolean;
  // CTAs personalizados
  social_links?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  ctas?: {
    key: string;
    label: string;
    type: string;
    url: string;
    icon?: string;
    style: string;
    priority: number;
    analytics_event?: string;
  }[];
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company_name?: string;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  company_id?: number;
  user_id?: number;
  created_at: string;
  updated_at: string;
  // Informações adicionais
  project_type?: string;
  budget_range?: string;
  timeline?: string;
  location?: string;
  company?: {
    id: number;
    name: string;
  };
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  company_id: number;
  created_at: string;
  updated_at: string;
  image_url?: string;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  user_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  user?: { id: number; name: string };
  product?: { id: number; name: string };
  company?: { name: string };
}

export interface Category {
  id: number;
  name: string;
  seo_url: string;
  seo_title: string;
  short_description?: string;
  description?: string;
  parent_id?: number | null;
  companies_count?: number;
  subcategories?: Category[];
  kind: string;
  status: string;
  featured: boolean;
  banner_url?: string | null;
  logo: {
    url: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  category_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  position: number;
  year: number;
  edition: string;
  category_id: number;
  products: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  companies_count: number;
  products_count: number;
  leads_count: number;
  reviews_count: number;
  active_campaigns: number;
  monthly_revenue: number;
  average_rating?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'company';
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface State {
  id: number;
  name: string;
  abbreviation: string;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: number;
  name: string;
  state_id: number;
  created_at: string;
  updated_at: string;
}

// =======================
// Axios Config
// =======================
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1`;

// Update the api configuration
export const api = {
  baseUrl: API_BASE_URL,
  
  request: async function<T>(config: any): Promise<{ data: T }> {
    try {
      const basePath = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
      const endpoint = config.url.startsWith('/') ? config.url.slice(1) : config.url;
      const url = `${basePath}/${endpoint}`;
      
      console.log('[API] Request ->', config.method, url, config.params || '');
      
      const response = await fetch(url, {
        method: config.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...config.headers,
        },
        body: config.data ? JSON.stringify(config.data) : config.body ? JSON.stringify(config.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`[${response.status}] ${response.statusText}`);
      }

      const data = await response.json().catch(() => ({}));
      return { data };
    } catch (error) {
      console.error('[API] Error:', error);
      throw error;
    }
  }
};

// Removed axios interceptor code that was causing errors

// =======================
// Generic fetch wrapper
// =======================
export async function fetchApi<T>(
  endpoint: string,
  options: any = {}
): Promise<T> {
  try {
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    console.log('[API] Fetching:', `${API_BASE_URL}/${cleanEndpoint}`);
    const response = await api.request<T>({
      url: cleanEndpoint,
      method: options.method || 'GET',
      data: options.body
        ? options.body instanceof FormData
          ? options.body
          : JSON.parse(options.body)
        : undefined,
      headers: { ...options.headers },
      params: options.params,
    });
    return response.data;
  } catch (error: any) {
    console.error('API error:', error);
    if (error.response) {
      throw new Error(
        error.response.data?.error ||
          `API error (${error.response.status})`
      );
    }
    throw new Error(error.message || 'Unknown API error');
  }
}

// =======================
// API Endpoints
// =======================
export const dashboardApi = {
  getStats: (): Promise<DashboardStats> => fetchApi('/dashboard/stats'),
};

export const companiesApi = {
  getAll: async (params?: any): Promise<Company[]> => {
    try {
      const response = await fetchApi<Company[]>('/companies', { params });
      return response || [];
    } catch (error) {
      console.error('Error fetching companies:', error);
      // Return empty array on error to prevent breaking the UI
      return [];
    }
  },
  getById: async (id: number): Promise<Company | null> => {
    try {
      const response = await fetchApi<{ company: Company }>(`/companies/${id}`);
      return response?.company || null;
    } catch (error) {
      console.error(`Error fetching company with ID ${id}:`, error);
      // Return null on error to prevent breaking the UI
      return null;
    }
  },
  getReviews: (id: number, params?: any) => {
    try {
      return fetchApi(`/companies/${id}/reviews`, { params });
    } catch (error) {
      console.error(`Error fetching reviews for company with ID ${id}:`, error);
      // Return empty array on error to prevent breaking the UI
      return Promise.resolve([]);
    }
  },
  getProducts: (id: number, params?: any) => {
    try {
      return fetchApi(`/companies/${id}/products`, { params });
    } catch (error) {
      console.error(`Error fetching products for company with ID ${id}:`, error);
      // Return empty array on error to prevent breaking the UI
      return Promise.resolve([]);
    }
  },
  getLeads: (id: number, params?: any) => {
    try {
      return fetchApi(`/companies/${id}/leads`, { params });
    } catch (error) {
      console.error(`Error fetching leads for company with ID ${id}:`, error);
      // Return empty array on error to prevent breaking the UI
      return Promise.resolve({ leads: [], meta: {} });
    }
  },
  updateLeadStatus: (companyId: number, leadId: number, status: Lead['status']) => {
    try {
      return fetchApi(`/companies/${companyId}/leads/${leadId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error(`Error updating lead status:`, error);
      throw error;
    }
  },
  create: (company: Partial<Company>) => {
    try {
      return fetchApi('/companies', {
        method: 'POST',
        body: JSON.stringify({ company }),
      });
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  },
  update: (id: number, company: Partial<Company>) => {
    try {
      return fetchApi(`/companies/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ company }),
      });
    } catch (error) {
      console.error(`Error updating company with ID ${id}:`, error);
      throw error;
    }
  },
  delete: (id: number) => {
    try {
      return fetchApi(`/companies/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error(`Error deleting company with ID ${id}:`, error);
      throw error;
    }
  },
  search: (query: string, filters?: any) => {
    try {
      return fetchApi(`/companies/search?q=${encodeURIComponent(query)}`, {
        params: filters,
      });
    } catch (error) {
      console.error('Error searching companies:', error);
      // Return empty array on error to prevent breaking the UI
      return Promise.resolve({ companies: [], meta: {} });
    }
  },
};

export const productsApi = {
  getAll: (params?: any) => fetchApi('/products', { params }),
  getById: (id: number) => fetchApi(`/products/${id}`),
  getReviews: (id: number, params?: any) =>
    fetchApi(`/products/${id}/reviews`, { params }),
  create: (product: Partial<Product>) =>
    fetchApi('/products', {
      method: 'POST',
      body: JSON.stringify({ product }),
    }),
  update: (id: number, product: Partial<Product>) =>
    fetchApi(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ product }),
    }),
  delete: (id: number) => fetchApi(`/products/${id}`, { method: 'DELETE' }),
  search: (query: string, filters?: any) =>
    fetchApi(`/products/search?q=${encodeURIComponent(query)}`, {
      params: filters,
    }),
};

export const categoriesApi = {
  getAll: () => fetchApi('/categories'),
  getById: (id: number) => fetchApi(`/categories/${id}`),
  create: (category: Partial<Category>) =>
    fetchApi('/categories', {
      method: 'POST',
      body: JSON.stringify({ category }),
    }),
  update: (id: number, category: Partial<Category>) =>
    fetchApi(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ category }),
    }),
  delete: (id: number) => fetchApi(`/categories/${id}`, { method: 'DELETE' }),
  search: (query: string) =>
    fetchApi(`/categories/search?q=${encodeURIComponent(query)}`),
};

export const leadsApi = {
  getAll: (params?: any) => fetchApi('/leads', { params }),
  getByCompany: (companyId: number, params?: any) => fetchApi(`/companies/${companyId}/leads`, { params }),
  getById: (id: number) => fetchApi(`/leads/${id}`),
  create: (lead: Partial<Lead>) =>
    fetchApi('/leads', {
      method: 'POST',
      body: JSON.stringify({ lead }),
    }),
  update: (id: number, lead: Partial<Lead>) =>
    fetchApi(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ lead }),
    }),
  delete: (id: number) => fetchApi(`/leads/${id}`, { method: 'DELETE' }),
  changeStatus: (id: number, status: Lead['status']) => 
    fetchApi(`/leads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

export const reviewsApi = {
  getAll: (params?: any) => fetchApi('/reviews', { params }),
  getById: (id: number) => fetchApi(`/reviews/${id}`),
  create: (review: Partial<Review>) =>
    fetchApi('/reviews', {
      method: 'POST',
      body: JSON.stringify({ review }),
    }),
  update: (id: number, review: Partial<Review>) =>
    fetchApi(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ review }),
    }),
  delete: (id: number) => fetchApi(`/reviews/${id}`, { method: 'DELETE' }),
};

export const articlesApi = {
  getAll: () => fetchApi('/articles'),
  getById: (id: number) => fetchApi(`/articles/${id}`),
  create: (article: Partial<Article>) =>
    fetchApi('/articles', {
      method: 'POST',
      body: JSON.stringify({ article }),
    }),
  update: (id: number, article: Partial<Article>) =>
    fetchApi(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ article }),
    }),
  delete: (id: number) => fetchApi(`/articles/${id}`, { method: 'DELETE' }),
};

export const badgesApi = {
  getAll: () => fetchApi('/badges'),
  getById: (id: number) => fetchApi(`/badges/${id}`),
  create: (badge: Partial<Badge>) =>
    fetchApi('/badges', {
      method: 'POST',
      body: JSON.stringify({ badge }),
    }),
  update: (id: number, badge: Partial<Badge>) =>
    fetchApi(`/badges/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ badge }),
    }),
  delete: (id: number) => fetchApi(`/badges/${id}`, { method: 'DELETE' }),
};

export const usersApi = {
  getAll: () => fetchApi('/users'),
  getById: (id: number) => fetchApi(`/users/${id}`),
  create: (user: Partial<User>) =>
    fetchApi('/users', {
      method: 'POST',
      body: JSON.stringify({ user }),
    }),
  update: (id: number, user: Partial<User>) =>
    fetchApi(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ user }),
    }),
  delete: (id: number) => fetchApi(`/users/${id}`, { method: 'DELETE' }),
};

export const authApi = {
  login: (email: string, password: string) =>
    fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email, password: password }),
    }),
  register: (userData: { name: string; email: string; password: string }) =>
    fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    try {
      await fetchApi('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Logout endpoint error:', error);
    }
  },
  me: (): Promise<User> => fetchApi('/auth/me'),
};

export const statesApi = {
  getAll: () => fetchApi('/states'),
  getById: (id: number) => fetchApi(`/states/${id}`),
  getCities: (id: number) => fetchApi(`/states/${id}/cities`),
};

export const citiesApi = {
  getAll: () => fetchApi('/cities'),
  getById: (id: number) => fetchApi(`/cities/${id}`),
  getByState: (stateId: number) =>
    fetchApi(`/states/${stateId}/cities`),
};

export const searchApi = {
  all: async (query: string, filters?: any) => {
    try {
      return await fetchApi(
        `/search/all?q=${encodeURIComponent(query)}`,
        { params: filters }
      );
    } catch (error) {
      console.error('Search error:', error);
      return {
        companies: [],
        products: [],
        categories: [],
        articles: [],
        meta: {
          total_count: 0,
          page: 1,
          per_page: 10,
          total_pages: 0,
        },
      };
    }
  },
  suggest: async (query: string) => {
    try {
      return await fetchApi(
        `/search/suggest?q=${encodeURIComponent(query)}`
      );
    } catch (error) {
      console.error('Suggestion error:', error);
      return { companies: [], products: [], categories: [], articles: [] };
    }
  },
};

export const adminApi = {
  importCategories: (formData: FormData) =>
    fetchApi('/admin/categories/import', {
      method: 'POST',
      body: formData,
    }),
};

// End of API endpoints

export async function login(email: string, password: string): Promise<{ user: User }> {
  try {
    const response = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    return { user: response.user };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
