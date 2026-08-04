import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { tmdbService } from '../services/tmdb';

export function usePopularMovies() {
  return useInfiniteQuery({
    queryKey: ['movies', 'popular'],
    queryFn: ({ pageParam = 1 }) => tmdbService.getPopularMovies(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
}

export function useSearchMovies(query: string) {
  return useQuery({
    queryKey: ['movies', 'search', query],
    queryFn: () => tmdbService.searchMovies(query),
    enabled: query.trim().length > 0,
    staleTime: 2 * 60 * 1000, // cache search results for 2 minutes
  });
}

export function useMovieDetails(id: number | null) {
  return useQuery({
    queryKey: ['movies', 'details', id],
    queryFn: () => tmdbService.getMovieDetails(id!),
    enabled: id !== null,
    staleTime: 10 * 60 * 1000, // cache movie details for 10 minutes
  });
}

export function useGenres() {
  return useQuery({
    queryKey: ['movies', 'genres'],
    queryFn: () => tmdbService.getGenres(),
    staleTime: 24 * 60 * 60 * 1000, // cache genres for 24 hours
  });
}
