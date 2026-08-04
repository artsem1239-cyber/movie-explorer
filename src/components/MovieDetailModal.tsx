import React, { useEffect } from 'react';
import { X, Bookmark, Star, Clock, Calendar, Film } from 'lucide-react';
import type { Movie } from '../types/movie';
import { useWatchlistStore } from '../store/watchlistStore';
import { useMovieDetails } from '../hooks/useMovies';
import { getBackdropUrl } from '../services/tmdb';

interface MovieDetailModalProps {
  movie: Movie;
  onClose: () => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ movie, onClose }) => {
  const { addToWatchlist, removeFromWatchlist, inWatchlist } = useWatchlistStore();
  const isBookmarked = inWatchlist(movie.id);

  // Fetch full details (genres, runtime, etc.) from API
  const { data: fullMovie, isLoading } = useMovieDetails(movie.id);

  // Handle escape key listener for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleWatchlistClick = () => {
    if (isBookmarked) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const runtime = fullMovie?.runtime || movie.runtime;
  const genres = fullMovie?.genres || movie.genres;

  const formatRuntime = (minutes?: number | null) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formattedRating = movie.vote_average
    ? movie.vote_average.toFixed(1)
    : 'N/A';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-300"
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()} // prevent overlay close
        className="relative w-full max-w-3xl glass-modal rounded-3xl overflow-hidden shadow-2xl animate-scale-in max-h-[90vh] flex flex-col"
      >
        {/* Backdrop Image Banner */}
        <div className="relative h-48 sm:h-64 bg-slate-950 shrink-0">
          <img
            src={getBackdropUrl(movie.backdrop_path)}
            alt={`Backdrop scene of ${movie.title}`}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md">
                <Star size={12} className="fill-current" />
                {formattedRating}
              </span>
              {movie.release_date && (
                <span className="flex items-center gap-1 bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                  <Calendar size={12} />
                  {movie.release_date}
                </span>
              )}
              {runtime !== undefined && (
                <span className="flex items-center gap-1 bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                  <Clock size={12} />
                  {isLoading ? 'Loading...' : formatRuntime(runtime)}
                </span>
              )}
            </div>
            
            <h2 id="modal-title" className="font-display font-extrabold text-2xl sm:text-3xl text-slate-100 leading-tight">
              {movie.title}
            </h2>
          </div>

          {/* Action button */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleWatchlistClick}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                isBookmarked
                  ? 'bg-emerald-600 hover:bg-emerald-750 text-white shadow-lg shadow-emerald-600/20 border border-emerald-500'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 border border-indigo-500'
              }`}
            >
              <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
              <span>{isBookmarked ? 'In Watchlist' : 'Add to Watchlist'}</span>
            </button>
          </div>

          {/* Synopsis */}
          <div className="flex flex-col gap-2">
            <h3 className="font-display font-semibold text-base text-slate-300">
              Synopsis
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {movie.overview || "No synopsis available."}
            </p>
          </div>

          {/* Genres Section */}
          <div className="flex flex-col gap-2.5">
            <h3 className="font-display font-semibold text-sm text-slate-300">
              Genres
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {isLoading ? (
                <div className="h-6 w-24 bg-slate-800 rounded animate-pulse" />
              ) : genres && genres.length > 0 ? (
                genres.map((g) => (
                  <span
                    key={g.id}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-800/40 border border-slate-800 text-slate-300 rounded-lg text-xs"
                  >
                    <Film size={10} />
                    {g.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">No genre details available.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
