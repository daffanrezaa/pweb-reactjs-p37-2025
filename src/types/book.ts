// src/types/book.ts

export interface Genre {
  id: string;
  name: string;
  description?: string;
}

export interface Book {
  id: string;
  title: string;
  writer: string;
  publisher: string;
  price: number;
  stockQuantity: number;
  genreId: string;
  genre: Genre;
  publicationYear: number; 
  image?: string;
  isbn?: string;
  description?: string;
  condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  createdAt?: string;
  updatedAt?: string;
}

export interface BookInput {
  title: string;
  writer: string;
  publisher: string;
  price: number;
  stockQuantity: number;
  genreId: string;
  publicationYear: number; // ✅ FIXED: Changed from optional to REQUIRED
  image?: string;
  isbn?: string;
  description?: string;
  condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
}

export interface BookListParams {
  search?: string;
  condition?: string;
  sortBy?: 'title' | 'publicationYear';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface BookListResponse {
  success: boolean;
  data: Book[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface BookDetailResponse {
  success: boolean;
  data: Book;
}

export interface BookCreateResponse {
  success: boolean;
  message: string;
  data: Book;
}

export interface BookDeleteResponse {
  success: boolean;
  message: string;
}