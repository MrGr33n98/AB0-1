// Remove the first declaration at the top and keep only one
// const API_BASE_URL = 'http://localhost:3000/api/v1';

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
  logo_url?: string; // Add logo URL field
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  company_id: number;
  created_at: string;
  updated_at: string;
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
// API base URL pointing to your Rails backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function for API requests with error handling and diagnostics
export async function fetchApi(endpoint, options = {}) {
  // Try different API configurations if we're in development
  const urls = [
    `${API_BASE_URL}${endpoint}`,
    `${API_BASE_URL}/api/v1${endpoint.startsWith('/api/v1') ? endpoint.substring(7) : endpoint}`,
    `${API_BASE_URL}${endpoint.startsWith('/api/v1') ? endpoint : '/api/v1' + endpoint}`
  ];
  
  let lastError = null;
  
  // Try each URL configuration
  for (const url of urls) {
    try {
      console.log(`Fetching from: ${url}`);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorDetail = '';
        try {
          // Try to parse as JSON first
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorJson = await response.json();
            errorDetail = errorJson.error || errorJson.message || JSON.stringify(errorJson);
          } else {
            // Fallback to text for non-JSON responses (like HTML error pages)
            const errorText = await response.text();
            // Extract meaningful message from HTML if possible
            const messageMatch = errorText.match(/<h1[^>]*>([^<]+)<\/h1>/i) ||
                               errorText.match(/<title[^>]*>([^<]+)<\/title>/i);
            errorDetail = messageMatch ? messageMatch[1].trim() : 'Unknown error';
          }
        } catch (e) {
          errorDetail = 'Could not parse error response';
        }
        
        console.error(`API Error (${response.status}):`, errorDetail);
        throw new Error(`API error (${response.status}): ${errorDetail}`);
      }

      // If we get here, the request was successful
      console.log(`✅ Successful API call to: ${url}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      lastError = error;
      // Continue to the next URL configuration
    }
  }
  
  // If we get here, all URL configurations failed
  console.error(`All API configurations failed for endpoint: ${endpoint}`);
  
  // Log diagnostic information
  console.log(`
    API Diagnostics:
    - Endpoint: ${endpoint}
    - Base URL: ${API_BASE_URL}
    - Method: ${options.method || 'GET'}
    - Headers: ${JSON.stringify(options.headers || {})}
    - Last Error: ${lastError?.message}
  `);
  
  throw new Error(`Error fetching ${endpoint}: ${lastError?.message}`);
}

// Function to provide mock data for development
function getMockDataForEndpoint(endpoint) {
  // Extract resource type from endpoint
  const path = endpoint.split('?')[0]; // Remove query params
  const parts = path.split('/').filter(p => p);
  const resource = parts[parts.length - 1];
  
  const mockData = {
    products: [
      {
        id: 1,
        name: "Painel Solar 450W",
        description: "Painel solar monocristalino de alta eficiência",
        price: 1200.00,
        company_id: 1,
        created_at: "2023-01-15T10:30:00Z",
        updated_at: "2023-01-15T10:30:00Z"
      },
      {
        id: 2,
        name: "Inversor 5kW",
        description: "Inversor solar grid-tie com monitoramento",
        price: 3500.00,
        company_id: 2,
        created_at: "2023-01-16T14:20:00Z",
        updated_at: "2023-01-16T14:20:00Z"
      }
    ],
    companies: [
      {
        id: 1,
        name: "Solar Solutions",
        description: "Empresa especializada em instalações solares residenciais",
        website: "https://solarsolutions.example.com",
        phone: "(11) 99999-8888",
        address: "Av. Paulista, 1000, São Paulo, SP",
        created_at: "2023-01-10T08:00:00Z",
        updated_at: "2023-01-10T08:00:00Z",
        banner_url: "/images/compare-solar-v1.png", // Using the correct image path
        logo_url: "/images/logo.png"
      },
      {
        id: 2,
        name: "Eco Energy",
        description: "Soluções completas em energia solar fotovoltaica",
        website: "https://ecoenergy.example.com",
        phone: "(21) 98888-7777",
        address: "Rua das Flores, 500, Rio de Janeiro, RJ",
        created_at: "2023-01-12T09:15:00Z",
        updated_at: "2023-01-12T09:15:00Z",
        banner_url: "/images/compare-solar-v1.png", // Using the correct image path
        logo_url: "/images/logo.png"
      },
      {
        id: 3,
        name: "Green Power",
        description: "Energia limpa e sustentável para todos",
        website: "https://greenpower.example.com",
        phone: "(31) 97777-6666",
        address: "Av. Brasil, 300, Belo Horizonte, MG",
        created_at: "2023-01-14T11:20:00Z",
        updated_at: "2023-01-14T11:20:00Z",
        banner_url: "/images/compare-solar-v1.png", // Using the correct image path
        logo_url: "/images/logo.png"
      }
    ],
    categories: [
      {
        id: 1,
        name: "Painéis Solares",
        seo_url: "paineis-solares",
        seo_title: "Painéis Solares | Compare Solar",
        short_description: "Painéis solares de alta eficiência",
        description: "Encontre os melhores painéis solares para sua instalação",
        parent_id: null,
        kind: "product",
        status: "active",
        featured: true,
        created_at: "2023-01-05T10:00:00Z",
        updated_at: "2023-01-05T10:00:00Z"
      }
    ]
  };
  
  return mockData[resource];
}

// Dashboard API
export const dashboardApi = {
  getStats: (): Promise<DashboardStats> => fetchApi('/api/v1/dashboard/stats'),
};

// Companies API
export const companiesApi = {
  getAll: (): Promise<Company[]> => fetchApi('/api/v1/companies'),
  getById: (id: number): Promise<Company> => fetchApi(`/api/v1/companies/${id}`),
  create: (company: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> =>
    fetchApi('/api/v1/companies', {
      method: 'POST',
      body: JSON.stringify({ company }),
    }),
  update: (id: number, company: Partial<Company>): Promise<Company> =>
    fetchApi(`/api/v1/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ company }),
    }),
  delete: (id: number): Promise<void> =>
    fetchApi(`/api/v1/companies/${id}`, { method: 'DELETE' }),
};

// Products API
export const productsApi = {
  getAll: (): Promise<Product[]> => fetchApi('/api/v1/products'),
  getById: (id: number): Promise<Product> => fetchApi(`/api/v1/products/${id}`),
  create: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> =>
    fetchApi('/api/v1/products', {
      method: 'POST',
      body: JSON.stringify({ product }),
    }),
  update: (id: number, product: Partial<Product>): Promise<Product> =>
    fetchApi(`/api/v1/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ product }),
    }),
  delete: (id: number): Promise<void> =>
    fetchApi(`/api/v1/products/${id}`, { method: 'DELETE' }),
};

// Leads API
export const leadsApi = {
  getAll: (): Promise<Lead[]> => fetchApi('/api/v1/leads'),
  getById: (id: number): Promise<Lead> => fetchApi(`/api/v1/leads/${id}`),
  create: (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> =>
    fetchApi('/api/v1/leads', {
      method: 'POST',
      body: JSON.stringify({ lead }),
    }),
  update: (id: number, lead: Partial<Lead>): Promise<Lead> =>
    fetchApi(`/api/v1/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ lead }),
    }),
  delete: (id: number): Promise<void> =>
    fetchApi(`/api/v1/leads/${id}`, { method: 'DELETE' }),
};

// Reviews API
export const reviewsApi = {
  getAll: (): Promise<Review[]> => fetchApi('/api/v1/reviews'),
  getById: (id: number): Promise<Review> => fetchApi(`/api/v1/reviews/${id}`),
  create: (review: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review> =>
    fetchApi('/api/v1/reviews', {
      method: 'POST',
      body: JSON.stringify({ review }),
    }),
  update: (id: number, review: Partial<Review>): Promise<Review> =>
    fetchApi(`/api/v1/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ review }),
    }),
  delete: (id: number): Promise<void> =>
    fetchApi(`/api/v1/reviews/${id}`, { method: 'DELETE' }),
};

// Categories API
// Add or update the categoriesApi object in your api.ts file

export const categoriesApi = {
  getAll: async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/categories`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }
    return response.json();
  },
  
  getById: async (id: number) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/categories/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.status}`);
    }
    return response.json();
  }
};

// Plans API
export const plansApi = {
  getAll: (): Promise<Plan[]> => fetchApi('/api/v1/plans'),
  getById: (id: number): Promise<Plan> => fetchApi(`/api/v1/plans/${id}`),
  create: (plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>): Promise<Plan> =>
    fetchApi('/api/v1/plans', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    }),
  update: (id: number, plan: Partial<Plan>): Promise<Plan> =>
    fetchApi(`/api/v1/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ plan }),
    }),
  delete: (id: number): Promise<void> =>
    fetchApi(`/api/v1/plans/${id}`, { method: 'DELETE' }),
};

// Articles API
export const articlesApi = {
  getAll: (): Promise<Article[]> => fetchApi('/api/v1/articles'),
  getById: (id: number): Promise<Article> => fetchApi(`/api/v1/articles/${id}`),
  create: (article: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<Article> =>
    fetchApi('/api/v1/articles', {
      method: 'POST',
      body: JSON.stringify({ article }),
    }),
  update: (id: number, article: Partial<Article>): Promise<Article> =>
    fetchApi(`/api/v1/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ article }),
    }),
  delete: (id: number): Promise<void> =>
    fetchApi(`/api/v1/articles/${id}`, { method: 'DELETE' }),
};

// Badges API
export const badgesApi = {
  getAll: (): Promise<Badge[]> => fetchApi('/api/v1/badges'),
  getById: (id: number): Promise<Badge> => fetchApi(`/api/v1/badges/${id}`),
  create: (badge: Omit<Badge, 'id' | 'created_at' | 'updated_at'>): Promise<Badge> =>
    fetchApi('/api/v1/badges', {
      method: 'POST',
      body: JSON.stringify({ badge }),
    }),
  update: (id: number, badge: Partial<Badge>): Promise<Badge> =>
    fetchApi(`/api/v1/badges/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ badge }),
    }),
  delete: (id: number): Promise<void> =>
    fetchApi(`/api/v1/badges/${id}`, { method: 'DELETE' }),
};

// Search API
export const searchApi = {
  companies: (query: string): Promise<Company[]> => 
    fetchApi(`/api/v1/search/companies?q=${encodeURIComponent(query)}`),
  products: (query: string): Promise<Product[]> => 
    fetchApi(`/api/v1/search/products?q=${encodeURIComponent(query)}`),
  articles: (query: string): Promise<Article[]> => 
    fetchApi(`/api/v1/search/articles?q=${encodeURIComponent(query)}`),
};