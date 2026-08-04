import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/Navbar';
import { Browse } from './pages/Browse';
import { Watchlist } from './pages/Watchlist';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // disable refetching on focus for consistent flow
      retry: 1, // retry once on failure
    },
  },
});

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname === '/watchlist' ? 'watchlist' : 'browse';

  const setActiveTab = (tab: 'browse' | 'watchlist') => {
    if (tab === 'browse') {
      navigate('/');
    } else {
      navigate('/watchlist');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="*" element={<Browse />} />
        </Routes>
      </main>
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} MovieExplorer. Built for the Movie Explorer Challenge.</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
