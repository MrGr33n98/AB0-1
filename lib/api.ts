// API Response Types
export interface Company {
  id: number;
  name: string;
  description: string;
  website: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
  banner_url?: string;
  logo_url?: string;
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

export async function fetchApi<T>(endpoint: string, options: any = {}): Promise<T> {
  // Garante que sempre tenha a barra inicial
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;
  
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
  getAll: (): Promise<Company[]> => fetchApi('/companies'),
  getById: (id: number): Promise<Company> => fetchApi(`/companies/${id}`),
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
};

// Products API
export const productsApi = {
  getAll: (): Promise<Product[]> => fetchApi('/products'),
  getById: (id: number): Promise<Product> => fetchApi(`/products/${id}`),
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
export const searchApi = {
  companies: (query: string): Promise<Company[]> =>
    fetchApi(`/search/companies?q=${encodeURIComponent(query)}`),
  products: (query: string): Promise<Product[]> =>
    fetchApi(`/search/products?q=${encodeURIComponent(query)}`),
  articles: (query: string): Promise<Article[]> =>
    fetchApi(`/search/articles?q=${encodeURIComponent(query)}`),
};

// Admin API
export const adminApi = {
  importCategories: (formData: FormData): Promise<any> =>
    fetchApi('/admin/categories/import', {
      method: 'POST',
      body: formData,
    }),
};
