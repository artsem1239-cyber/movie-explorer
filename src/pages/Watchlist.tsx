import React, { useState } from 'react';
import { useWatchlistStore } from '../store/watchlistStore';
import { MovieCard } from '../components/MovieCard';
import { MovieDetailModal } from '../components/MovieDetailModal';
import type { Movie } from '../types/movie';
import { GenreFilter } from '../components/GenreFilter';
import { Bookmark, ArrowUpDown } from 'lucide-react';

export const Watchlist: React.FC = () => {
  const { watchlist, sortBy, setSortBy, searchQuery, selectedGenres } = useWatchlistStore();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Filter watchlist based on search and genre filters
  const getFilteredWatchlist = () => {
    let list = [...watchlist];

    // Filter by search query
    if (searchQuery.trim()) {
      list = list.filter((item) =>
        item.movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected genre chips
    if (selectedGenres.length > 0) {
      list = list.filter((item) =>
        selectedGenres.every((genreId) => item.movie.genre_ids.includes(genreId))
      );
    }

    // Apply sorting
    list.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.movie.vote_average - a.movie.vote_average;
      } else {
        // Default: Sort by date added (newest first)
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      }
    });

    return list;
  };

  const filteredWatchlist = getFilteredWatchlist();

  return (
    <div className="flex flex-col gap-6 sm:gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-3 max-w-2xl">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
          <Bookmark size={14} className="fill-current" />
          <span>Curated List</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100">
          Your Personal <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Watchlist</span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Keep track of movies you want to watch or have loved. You can sort them by rating or release date.
        </p>
      </div>

      {/* Filter Component */}
      <GenreFilter />

      {/* Sorting and Summary Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-900 pb-3">
        <span className="text-xs text-slate-400 font-medium">
          {filteredWatchlist.length} {filteredWatchlist.length === 1 ? 'movie' : 'movies'} in your list
        </span>

        {/* Sort Select Dropdown */}
        {watchlist.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 flex items-center gap-1 font-medium">
              <ArrowUpDown size={12} />
              Sort by:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
                className="bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-xs font-semibold appearance-none pr-7 transition"
              >
                <option value="date">Date Added</option>
                <option value="rating">Rating</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-500">
                ▼
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Watchlist Main Render */}
      {watchlist.length === 0 ? (
        // Empty Watchlist State
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-slate-900/10 border border-slate-900/60 rounded-2xl">
          <div className="bg-slate-900/60 p-4 rounded-full text-slate-500 border border-slate-850">
            <Bookmark size={36} />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <h3 className="font-display font-semibold text-slate-200 text-base">Your Watchlist is empty</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore new releases and click the bookmark button on any movie card to add it here.
            </p>
          </div>
        </div>
      ) : filteredWatchlist.length === 0 ? (
        // Filtered Empty State
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3 bg-slate-900/10 border border-slate-900/60 rounded-2xl">
          <h3 className="font-display font-semibold text-slate-300">No matching movies</h3>
          <p className="text-xs text-slate-400 max-w-xs">
            Your search query or selected genre filters didn't match any movies in your watchlist.
          </p>
        </div>
      ) : (
        // Movie List Grid
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 sm:gap-6">
          {filteredWatchlist.map((item) => (
            <MovieCard
              key={item.movie.id}
              movie={item.movie}
              onSelect={setSelectedMovie}
            />
          ))}
        </div>
      )}

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};
