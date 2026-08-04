import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Movie } from '../types/movie';

export interface WatchlistItem {
  movie: Movie;
  addedAt: string; // ISO string
}

interface WatchlistState {
  // Watchlist Items
  watchlist: WatchlistItem[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  inWatchlist: (movieId: number) => boolean;
  
  // Watchlist Sorting
  sortBy: 'date' | 'rating';
  setSortBy: (sortBy: 'date' | 'rating') => void;

  // Global Filters & Search State (combining search and genre chips)
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenres: number[]; // IDs of selected genres
  toggleGenre: (genreId: number) => void;
  clearFilters: () => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      addToWatchlist: (movie) => {
        const current = get().watchlist;
        if (current.some((item) => item.movie.id === movie.id)) return;
        
        const newItem: WatchlistItem = {
          movie,
          addedAt: new Date().toISOString(),
        };
        set({ watchlist: [newItem, ...current] });
      },
      removeFromWatchlist: (movieId) => {
        set({
          watchlist: get().watchlist.filter((item) => item.movie.id !== movieId),
        });
      },
      inWatchlist: (movieId) => {
        return get().watchlist.some((item) => item.movie.id === movieId);
      },
      
      sortBy: 'date',
      setSortBy: (sortBy) => set({ sortBy }),

      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      selectedGenres: [],
      toggleGenre: (genreId) => {
        const current = get().selectedGenres;
        const next = current.includes(genreId)
          ? current.filter((id) => id !== genreId)
          : [...current, genreId];
        set({ selectedGenres: next });
      },
      clearFilters: () => set({ searchQuery: '', selectedGenres: [] }),
    }),
    {
      name: 'movie-explorer-storage', // key in localStorage
      storage: createJSONStorage(() => localStorage),
      // Partialize to only persist the watchlist
      partialize: (state) => ({
        watchlist: state.watchlist,
        sortBy: state.sortBy,
      }),
    }
  )
);
