import React from 'react';
import { useGenres } from '../hooks/useMovies';
import { useWatchlistStore } from '../store/watchlistStore';
import { X, Filter } from 'lucide-react';

export const GenreFilter: React.FC = () => {
  const { data: genresData, isLoading, isError } = useGenres();
  const { selectedGenres, toggleGenre, clearFilters, searchQuery } = useWatchlistStore();

  const genres = genresData?.genres || [];

  if (isError) return null; // fail silently, or show nothing to keep clean UI

  const hasActiveFilters = selectedGenres.length > 0 || searchQuery.length > 0;

  return (
    <div className="flex flex-col gap-3.5 w-full bg-slate-900/20 border border-slate-900/60 p-4 sm:p-5 rounded-2xl">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
          <Filter size={16} className="text-indigo-400" />
          <span>Filter by Genre</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition"
          >
            <X size={12} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {isLoading ? (
        // Skeletal loading state for chips
        <div className="flex flex-wrap gap-2 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-7 w-16 bg-slate-800 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
          {genres.map((genre) => {
            const isSelected = selectedGenres.includes(genre.id);
            return (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {genre.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
