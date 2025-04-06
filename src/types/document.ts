export interface Category {
  category_id: number;
  category_name: string;
  description: string | null;
}

export interface Document {
  id: number;
  title: string;
  description: string;
  price: number;
  file_path: string;
  preview_url?: string;
  category_id: number;
  category_name: string;
  created_at: string;
}

export interface DocumentCategory {
  category_id: number;
  category_name: string;
  description?: string;
} 