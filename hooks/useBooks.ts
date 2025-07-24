import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

export interface Book {
  id: string;
  title: string;
  author: string;
}

export interface CreateBookData {
  title: string;
  author: string;
}

export interface UpdateBookData {
  title: string;
  author: string;
}

// Hook to fetch all books
export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/books');
      setBooks(response.data);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.error || err.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    books,
    loading,
    error,
    refetch: fetchBooks,
  };
}

// Hook to create a new book
export function useCreateBook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBook = useCallback(async (data: CreateBookData): Promise<Book | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/api/books', data);
      return response.data;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.error || err.message 
        : 'Failed to create book';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createBook,
    loading,
    error,
    clearError: () => setError(null),
  };
}

// Hook to update a book
export function useUpdateBook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBook = useCallback(async (id: string, data: UpdateBookData): Promise<Book | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`/api/books/${id}`, data);
      return response.data;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.error || err.message 
        : 'Failed to update book';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateBook,
    loading,
    error,
    clearError: () => setError(null),
  };
}

// Hook to delete a book
export function useDeleteBook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteBook = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`/api/books/${id}`);
      return true;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.error || err.message 
        : 'Failed to delete book';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteBook,
    loading,
    error,
    clearError: () => setError(null),
  };
}

// Hook to get a single book
export function useBook(id: string | null) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBook = useCallback(async (bookId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/books/${bookId}`);
      setBook(response.data);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.error || err.message 
        : 'Failed to fetch book';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchBook(id);
    } else {
      setBook(null);
      setError(null);
    }
  }, [id, fetchBook]);

  return {
    book,
    loading,
    error,
    refetch: id ? () => fetchBook(id) : undefined,
  };
}
