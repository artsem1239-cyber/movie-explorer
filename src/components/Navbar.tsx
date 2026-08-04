import React from 'react';
import { Film, Bookmark, Search, Compass, AlertTriangle } from 'lucide-react';
import { useWatchlistStore } from '../store/watchlistStore';
import { isDemoMode } from '../services/tmdb';

interface NavbarProps {
  activeTab: 'browse' | 'watchlist';
  setActiveTab: (tab: 'browse' | 'watchlist') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { searchQuery, setSearchQuery, watchlist } = useWatchlistStore();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800">
      {isDemoMode && (
        <div className="bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-100 text-xs px-4 py-1.5 flex items-center justify-center gap-2 font-medium">
          <AlertTriangle size={14} className="animate-bounce" />
          <span>Using Demo Mode (No TMDB API key configured. Set VITE_TMDB_API_KEY in your .env file to enable live data).</span>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => { setActiveTab('browse'); setSearchQuery(''); }}>
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/25">
            <Film size={20} />
          </div>
          <span className="font-display font-bold text-xl bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent hidden sm:inline-block">
            MovieExplorer
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md mx-2">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search movies by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl text-sm placeholder-slate-400 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-200"
          />
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition duration-200 ${
              activeTab === 'browse'
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Compass size={16} />
            <span className="hidden xs:inline">Browse</span>
          </button>
          
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition duration-200 relative ${
              activeTab === 'watchlist'
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Bookmark size={16} />
            <span className="hidden xs:inline">Watchlist</span>
            {watchlist.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white ring-2 ring-[#080b11]">
                {watchlist.length}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
