export interface Category {
  id: number;
  name: string;
  description: string;
  short_description?: string;
  seo_title?: string;
  seo_url?: string;
  parent_id?: number;
  kind?: string;
  status?: string;
  featured?: boolean;
}