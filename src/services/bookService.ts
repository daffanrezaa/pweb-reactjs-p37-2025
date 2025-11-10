// src/services/bookService.ts
import { axiosPrivate, axiosPublic } from '../lib/axiosConfig';
import type {
  Book,
  BookInput,
  BookListParams,
  BookListResponse,
  BookDetailResponse,
  BookCreateResponse,
  BookDeleteResponse,
  Genre,
} from '../types/book';

const BOOK_API = '/books';
const GENRE_API = '/genre';

// Get All Books (with filters, search, sort, pagination)
export const getAllBooks = async (params?: BookListParams): Promise<BookListResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.search) queryParams.append('search', params.search);
  if (params?.condition) queryParams.append('condition', params.condition);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.order) queryParams.append('order', params.order);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const url = queryParams.toString() ? `${BOOK_API}?${queryParams}` : BOOK_API;
  
  const response = await axiosPublic.get<BookListResponse>(url);
  return response.data;
};

// Get Book Detail by ID
export const getBookById = async (id: string): Promise<Book> => {
  const response = await axiosPublic.get<BookDetailResponse>(`${BOOK_API}/${id}`);
  return response.data.data;
};

// Create New Book (Protected - requires auth)
export const createBook = async (bookData: BookInput): Promise<Book> => {
  const response = await axiosPrivate.post<BookCreateResponse>(BOOK_API, bookData);
  return response.data.data;
};

// Update Book (Protected - requires auth)
export const updateBook = async (id: string, bookData: Partial<BookInput>): Promise<Book> => {
  const response = await axiosPrivate.put<BookCreateResponse>(`${BOOK_API}/${id}`, bookData);
  return response.data.data;
};

// Delete Book (Protected - requires auth)
export const deleteBook = async (id: string): Promise<void> => {
  await axiosPrivate.delete<BookDeleteResponse>(`${BOOK_API}/${id}`);
};

// Get All Genres (for dropdown)
export const getAllGenres = async (): Promise<Genre[]> => {
  const response = await axiosPublic.get<{ success: boolean; data: Genre[] }>(GENRE_API);
  return response.data.data;
};

export const bookService = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getAllGenres,
};