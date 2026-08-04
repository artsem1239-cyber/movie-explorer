import React from 'react';
import { Bookmark, Star, Calendar } from 'lucide-react';
import type { Movie } from '../types/movie';
import { useWatchlistStore } from '../store/watchlistStore';
import { getPosterUrl } from '../services/tmdb';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {
  const { addToWatchlist, removeFromWatchlist, inWatchlist } = useWatchlistStore();
  const isBookmarked = inWatchlist(movie.id);

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A';

  const formattedRating = movie.vote_average
    ? movie.vote_average.toFixed(1)
    : 'N/A';

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent modal opening
    if (isBookmarked) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  // Color coding for movie ratings
  const getRatingBadgeClass = (rating: number) => {
    if (rating >= 7) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (rating >= 5) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
  };

  return (
    <div
      onClick={() => onSelect(movie)}
      className="group relative flex flex-col bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 hover:border-indigo-500/30 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 animate-fade-in"
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-950">
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={`Poster of the movie ${movie.title}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Rating overlay */}
        {movie.vote_average > 0 && (
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md ${getRatingBadgeClass(movie.vote_average)}`}>
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-current" />
              <span>{formattedRating}</span>
            </div>
          </div>
        )}

        {/* Watchlist toggle overlay button */}
        <button
          onClick={handleWatchlistClick}
          aria-label={isBookmarked ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all duration-300 border ${
            isBookmarked
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30 scale-110'
              : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white hover:scale-105'
          }`}
        >
          <Bookmark size={15} className={isBookmarked ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Info Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Calendar size={12} />
            <span>{releaseYear}</span>
          </div>
          <h3 className="font-display font-semibold text-base text-slate-100 group-hover:text-indigo-400 line-clamp-1 transition duration-200">
            {movie.title}
          </h3>
        </div>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {movie.overview || "No overview available."}
        </p>
      </div>
    </div>
  );
};
