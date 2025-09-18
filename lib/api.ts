// Move the axios import to the top of the file
import axios from 'axios';

// API Response Types
export interface Company {
  id: number;
  name: string;
  description: string;
  website: string;
  phone: string;
  address: string;
  state?: string;
  city?: string;
  created_at: string;
  updated_at: string;
  banner_url?: string;
  logo_url?: string;
  rating?: number;
  total_reviews?: number;
  business_hours?: string;
  payment_methods?: string[];
  category_name?: string;
  category_id?: number;
  status?: 'active' | 'inactive';
  featured?: boolean;
  // Campos adicionados na migração
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
  highlights?: string;
  about?: string;
  media_gallery?: string;
  // Campos de CTAs
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
}

export interface Category {
  id: number;
  name: string;
  seo_url: string;
  seo_title: string;
  short_description?: string;
  description?: string;
  parent_id?: number;
  kind: string;
  status: string;
  featured: boolean;
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
}

// Generic fetch function
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication if needed
api.interceptors.request.use((config) => {
  // You can add auth token here if needed
  return config;
});

export async function fetchApi<T>(endpoint: string, options: any = {}): Promise<T> {
  // Garante que sempre tenha a barra inicial e codifica caracteres especiais
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = encodeURI(`${API_BASE_URL}${cleanEndpoint}`);
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Token só se rodar no browser
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

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
}

// Dashboard API
export const dashboardApi = {
  getStats: (): Promise<DashboardStats> => fetchApi('/dashboard/stats'),
};

// Companies API
export const companiesApi = {
  getAll: (params?: { status?: 'active' | 'inactive'; featured?: boolean; category_id?: number; limit?: number }): Promise<Company[]> => {
    let url = '/companies';
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    return fetchApi(url);
  },
  getById: (id: number): Promise<Company> => fetchApi(`/companies/${id}`),
  getReviews: (id: number, params?: { page?: number; per_page?: number }): Promise<{ reviews: Review[]; meta: { total_count: number; page: number; per_page: number; total_pages: number } }> => {
    let url = `/companies/${id}/reviews`;
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    return fetchApi(url);
  },
  getProducts: (id: number, params?: { page?: number; per_page?: number }): Promise<{ products: Product[]; meta: { total_count: number; page: number; per_page: number; total_pages: number } }> => {
    let url = `/companies/${id}/products`;
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    return fetchApi(url);
  },
  create: (company: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> =>
    fetchApi('/companies', {
      method: 'POST',
      body: JSON.stringify({ company }),
    }),
  update: (id: number, company: Partial<Company>): Promise<Company> =>
    fetchApi(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ company }),
    }),
  delete: (id: number): Promise<void> =>
    fetchApi(`/companies/${id}`, { method: 'DELETE' }),
  search: (query: string, filters?: {
    state?: string;
    city?: string;
    category_id?: number;
    sort?: 'rating' | 'name' | 'created_at';
    page?: number;
    per_page?: number;
  }): Promise<{ companies: Company[]; meta: { total_count: number; page: number; per_page: number; total_pages: number } }> => {
    let url = `/companies/search?q=${encodeURIComponent(query)}`;
    
    if (filters) {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
      if (queryParams.toString()) {
        url += `&${queryParams.toString()}`;
      }
    }
    
    return fetchApi(url);
  },
};

// Products API
export const productsApi = {
  getAll: (params?: { category_id?: number; company_id?: number; featured?: boolean; limit?: number; page?: number; per_page?: number }): Promise<{ products: Product[]; meta: { total_count: number; page: number; per_page: number; total_pages: number } }> => {
    let url = '/products';
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    return fetchApi(url);
  },
  getById: (id: number): Promise<Product> => fetchApi(`/products/${id}`),
  getReviews: (id: number, params?: { page?: number; per_page?: number }): Promise<{ reviews: Review[]; meta: { total_count: number; page: number; per_page: number; total_pages: number } }> => {
    let url = `/products/${id}/reviews`;
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    return fetchApi(url);
  },
  create: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> =>
    fetchApi('/products', {
      method: 'POST',
      body: JSON.stringify({ product }),
    }),
  update: (id: number, product: Partial<Product>): Promise<Product> =>
    fetchApi(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ product }),
    }),
  delete: (id: number): Promise<void> =>
    fetchApi(`/products/${id}`, { method: 'DELETE' }),
  search: (query: string, filters?: {
    category_id?: number;
    company_id?: number;
    sort?: 'price' | 'name' | 'created_at';
    page?: number;
    per_page?: number;
  }): Promise<{ products: Product[]; meta: { total_count: number; page: number; per_page: number; total_pages: number } }> => {
    let url = `/products/search?q=${encodeURIComponent(query)}`;
    
    if (filters) {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
      if (queryParams.toString()) {
        url += `&${queryParams.toString()}`;
      }
    }
    
    return fetchApi(url);
  },
};

// Categories API
export const categoriesApi = {
  getAll: (): Promise<Category[]> => fetchApi('/categories'),
  getById: (id: number): Promise<Category> => fetchApi(`/categories/${id}`),
  create: (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> =>
    fetchApi('/categories', {
      method: 'POST',
      body: JSON.stringify({ category }),
    }),
  update: (id: number, category: Partial<Category>): Promise<Category> =>
    fetchApi(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ category }),
    }),
  delete: (id: number): Promise<void> =>
    fetchApi(`/categories/${id}`, { method: 'DELETE' }),
  search: (query: string): Promise<Category[]> =>
    fetchApi(`/api/categories/search?q=${encodeURIComponent(query)}`),
};

// Leads API
export const leadsApi = {
  getAll: (): Promise<Lead[]> => fetchApi('/leads'),
  getById: (id: number): Promise<Lead> => fetchApi(`/leads/${id}`),
  create: (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> =>
    fetchApi('/leads', {
      method: 'POST',
      body: JSON.stringify({ lead }),
    }),
  update: (id: number, lead: Partial<Lead>): Promise<Lead> =>
    fetchApi(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ lead }),
    }),
  delete: (id: number): Promise<void> =>
    fetchApi(`/leads/${id}`, { method: 'DELETE' }),
};

// Reviews API
export const reviewsApi = {
  getAll: (): Promise<Review[]> => fetchApi('/reviews'),
  getById: (id: number): Promise<Review> => fetchApi(`/reviews/${id}`),
  create: (review: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review> =>
    fetchApi('/reviews', {
      method: 'POST',
      body: JSON.stringify({ review }),
    }),
  update: (id: number, review: Partial<Review>): Promise<Review> =>
    fetchApi(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ review }),
    }),
  delete: (id: number): Promise<void> =>
    fetchApi(`/reviews/${id}`, { method: 'DELETE' }),
};

// Plans API
export const plansApi = {
  getAll: (): Promise<Plan[]> => fetchApi('/plans'),
  getById: (id: number): Promise<Plan> => fetchApi(`/plans/${id}`),
  create: (plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>): Promise<Plan> =>
    fetchApi('/plans', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    }),
  update: (id: number, plan: Partial<Plan>): Promise<Plan> =>
    fetchApi(`/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ plan }),
    }),
  delete: (id: number): Promise<void> =>
    fetchApi(`/plans/${id}`, { method: 'DELETE' }),
};

// Articles API
export const articlesApi = {
  getAll: (): Promise<Article[]> => fetchApi('/articles'),
  getById: (id: number): Promise<Article> => fetchApi(`/articles/${id}`),
  create: (article: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<Article> =>
    fetchApi('/articles', {
      method: 'POST',
      body: JSON.stringify({ article }),
    }),
  update: (id: number, article: Partial<Article>): Promise<Article> =>
    fetchApi(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ article }),
    }),
  delete: (id: number): Promise<void> =>
    fetchApi(`/articles/${id}`, { method: 'DELETE' }),
};

// Badges API
export const badgesApi = {
  getAll: (): Promise<Badge[]> => fetchApi('/badges'),
  getById: (id: number): Promise<Badge> => fetchApi(`/badges/${id}`),
  create: (badge: Omit<Badge, 'id' | 'created_at' | 'updated_at'>): Promise<Badge> =>
    fetchApi('/badges', {
      method: 'POST',
      body: JSON.stringify({ badge }),
    }),
  update: (id: number, badge: Partial<Badge>): Promise<Badge> =>
    fetchApi(`/badges/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ badge }),
    }),
  delete: (id: number): Promise<void> =>
    fetchApi(`/badges/${id}`, { method: 'DELETE' }),
};

// Search API
// Add these interfaces with the existing interfaces
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

export const statesApi = {
  getAll: (): Promise<State[]> => fetchApi('/states'),
  getById: (id: number): Promise<State> => fetchApi(`/states/${id}`),
  getCities: (id: number): Promise<City[]> => fetchApi(`/states/${id}/cities`),
};

export const citiesApi = {
  getAll: (): Promise<City[]> => fetchApi('/cities'),
  getById: (id: number): Promise<City> => fetchApi(`/cities/${id}`),
  getByState: (stateId: number): Promise<City[]> => fetchApi(`/states/${stateId}/cities`),
};

// Search API
export const searchApi = {
  all: async (query: string, filters?: {
    state?: string;
    city?: string;
    category?: string;
    sort?: 'rating' | 'name' | 'created_at';
    page?: number;
    per_page?: number;
  }): Promise<{
    companies: Company[];
    products: Product[];
    categories: Category[];
    articles: Article[];
    meta: {
      total_count: number;
      page: number;
      per_page: number;
      total_pages: number;
    }
  }> => {
    try {
      let url = `/search/all?q=${encodeURIComponent(query)}`;
      
      if (filters) {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value.toString());
        });
        url += `&${queryParams.toString()}`;
      }
      
      return await fetchApi(url);
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
          total_pages: 0
        }
      };
    }
  },

  suggest: async (query: string): Promise<{
    companies: Pick<Company, 'id' | 'name' | 'city' | 'state'>[];
    products: Pick<Product, 'id' | 'name'>[];
    categories: Pick<Category, 'id' | 'name'>[];
    articles: Pick<Article, 'id' | 'title'>[];
  }> => {
    try {
      return await fetchApi(`/search/suggest?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Suggestion error:', error);
      return {
        companies: [],
        products: [],
        categories: [],
        articles: []
      };
    }
  }
};

// Admin API
export const adminApi = {
  importCategories: (formData: FormData): Promise<any> =>
    fetchApi('/admin/categories/import', {
      method: 'POST',
      body: formData,
    }),
};
