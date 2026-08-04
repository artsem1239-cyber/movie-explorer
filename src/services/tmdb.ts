import type { Movie, Genre, TMDBResponse } from '../types/movie';
import { MOCK_MOVIES, MOCK_GENRES } from './mockData';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Read API Key from Vite env (supports standard v3 API key or v4 read token)
const API_KEY = (import.meta.env.VITE_TMDB_API_KEY || '').trim();

export const isDemoMode = true; // Forced to display only the user's custom list of 26 movies

// Helpers to build image URLs with fallbacks
export const getPosterUrl = (path: string | null, size: 'w185' | 'w342' | 'w500' = 'w342'): string => {
  if (!path) return 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=342&q=80'; // cinematic fallback
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: 'w780' | 'w1280' | 'original' = 'w780'): string => {
  if (!path) return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1280&q=80'; // cinematic fallback
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Helper for fetch requests
async function fetchFromTMDB<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  if (isDemoMode) {
    throw new Error('API key not configured');
  }

  const queryParams = new URLSearchParams();
  
  // Detect if API_KEY is a Bearer Token (very long) or v3 API Key (32 chars)
  const isBearer = API_KEY.length > 50;
  
  if (!isBearer) {
    queryParams.append('api_key', API_KEY);
  }

  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, String(value));
  });

  const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (isBearer) {
    headers['Authorization'] = `Bearer ${API_KEY}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.status_message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// API Service functions
export const tmdbService = {
  getPopularMovies: async (page = 1): Promise<TMDBResponse<Movie>> => {
    if (isDemoMode) {
      // Simulate pagination with mock data
      // Return 8 movies per page for custom pagination simulation
      const perPage = 8;
      const totalPages = Math.ceil(MOCK_MOVIES.length / perPage);
      const start = (page - 1) * perPage;
      const results = MOCK_MOVIES.slice(start, start + perPage);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            page,
            results,
            total_pages: totalPages,
            total_results: MOCK_MOVIES.length
          });
        }, 400); // simulate network latency
      });
    }

    return fetchFromTMDB<TMDBResponse<Movie>>('/movie/popular', { page });
  },

  searchMovies: async (query: string, page = 1): Promise<TMDBResponse<Movie>> => {
    if (!query.trim()) {
      return { page: 1, results: [], total_pages: 1, total_results: 0 };
    }

    if (isDemoMode) {
      const filtered = MOCK_MOVIES.filter(m => 
        m.title.toLowerCase().includes(query.toLowerCase())
      );
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            page: 1,
            results: filtered,
            total_pages: 1,
            total_results: filtered.length
          });
        }, 300);
      });
    }

    return fetchFromTMDB<TMDBResponse<Movie>>('/search/movie', { query, page });
  },

  getMovieDetails: async (id: number): Promise<Movie> => {
    if (isDemoMode) {
      const movie = MOCK_MOVIES.find(m => m.id === id);
      if (!movie) throw new Error('Movie not found');
      return new Promise((resolve) => {
        setTimeout(() => resolve(movie), 200);
      });
    }

    return fetchFromTMDB<Movie>(`/movie/${id}`);
  },

  getGenres: async (): Promise<{ genres: Genre[] }> => {
    if (isDemoMode) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ genres: MOCK_GENRES }), 100);
      });
    }

    return fetchFromTMDB<{ genres: Genre[] }>('/genre/movie/list');
  }
};
