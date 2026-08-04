import React, { useState, useEffect, useRef } from 'react';
import { usePopularMovies, useSearchMovies } from '../hooks/useMovies';
import { useWatchlistStore } from '../store/watchlistStore';
import { useDebounce } from '../hooks/useDebounce';
import { MovieCard } from '../components/MovieCard';
import { GenreFilter } from '../components/GenreFilter';
import { MovieDetailModal } from '../components/MovieDetailModal';
import type { Movie } from '../types/movie';
import { AlertCircle, Film, Sparkles } from 'lucide-react';

export const Browse: React.FC = () => {
  const { searchQuery, selectedGenres } = useWatchlistStore();
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Popular movies query (infinite list)
  const {
    data: popularData,
    isLoading: isPopularLoading,
    isError: isPopularError,
    error: popularError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePopularMovies();

  // Search query (only runs when search query is entered)
  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError,
  } = useSearchMovies(debouncedSearchQuery);

  const loaderRef = useRef<HTMLDivElement>(null);

  // Setup infinite scroll observer for automatic loading
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || debouncedSearchQuery) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, debouncedSearchQuery]);

  // Combine fetch models and apply filters
  const getFilteredMovies = (): Movie[] => {
    let movies: Movie[] = [];

    if (debouncedSearchQuery) {
      // Use search results
      movies = searchData?.results || [];
    } else {
      // Flatten all pages of popular movies
      movies = popularData?.pages.flatMap((page) => page.results) || [];
    }

    // Filter by genre chips if any are selected
    if (selectedGenres.length > 0) {
      movies = movies.filter((movie) =>
        selectedGenres.every((genreId) => movie.genre_ids.includes(genreId))
      );
    }

    return movies;
  };

  const filteredMovies = getFilteredMovies();
  const isLoading = debouncedSearchQuery ? isSearchLoading : isPopularLoading;
  const isError = debouncedSearchQuery ? isSearchError : isPopularError;
  const error = debouncedSearchQuery ? searchError : popularError;

  return (
    <div className="flex flex-col gap-6 sm:gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Intro Banner */}
      {!debouncedSearchQuery && (
        <div className="flex flex-col gap-2.5 max-w-2xl animate-fade-in">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Discover Cinema</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-100 leading-tight">
            Explore Popular <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Movies & Shows</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Search titles, filter by genres, and bookmark movies to build your ultimate watchlist.
          </p>
        </div>
      )}

      {/* Filter Component */}
      <GenreFilter />

      {/* Grid Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <h2 className="font-display font-bold text-lg sm:text-xl text-slate-200">
          {debouncedSearchQuery
            ? `Search Results for "${debouncedSearchQuery}"`
            : 'Popular Movies'}
        </h2>
        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredMovies.length} movies
        </span>
      </div>

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center p-8 bg-rose-500/5 border border-rose-500/10 rounded-2xl text-center gap-3">
          <AlertCircle className="text-rose-500" size={36} />
          <h3 className="font-display font-semibold text-slate-200">Failed to load movies</h3>
          <p className="text-xs text-slate-400 max-w-md">
            {error instanceof Error ? error.message : 'An unexpected error occurred while fetching movies. Please try again later.'}
          </p>
        </div>
      )}

      {/* Grid List */}
      {!isError && (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 sm:gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={setSelectedMovie}
            />
          ))}
        </div>
      )}

      {/* Empty Search Result State */}
      {!isLoading && !isError && filteredMovies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3 bg-slate-900/10 border border-slate-900/60 rounded-2xl">
          <Film className="text-slate-500" size={40} />
          <h3 className="font-display font-semibold text-slate-300">No movies found</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Try adjusting your search criteria or genre filters to find what you're looking for.
          </p>
        </div>
      )}

      {/* Loading Skeletal Cards */}
      {isLoading && (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-slate-900/20 border border-slate-900/60 rounded-2xl overflow-hidden aspect-[2/3.5] animate-pulse flex flex-col justify-end p-4 gap-3"
            >
              <div className="h-4 w-1/3 bg-slate-800 rounded" />
              <div className="h-6 w-3/4 bg-slate-800 rounded" />
              <div className="h-4 w-full bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Infinite Scroll trigger / Load More fallback */}
      {!debouncedSearchQuery && hasNextPage && !isLoading && !isError && (
        <div ref={loaderRef} className="flex justify-center items-center py-6">
          {isFetchingNextPage ? (
            <div className="spinner" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="px-6 py-2.5 bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition"
            >
              Load More Movies
            </button>
          )}
        </div>
      )}

      {/* Movie Details Modal overlay */}
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};
