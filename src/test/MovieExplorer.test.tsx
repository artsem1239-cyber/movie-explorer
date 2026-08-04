import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { useDebounce } from '../hooks/useDebounce';
import { useWatchlistStore } from '../store/watchlistStore';
import { GenreFilter } from '../components/GenreFilter';
import { useGenres } from '../hooks/useMovies';

// Mock the useGenres hook
vi.mock('../hooks/useMovies', () => ({
  useGenres: vi.fn(),
}));

const mockGenresList = {
  genres: [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
  ],
};

describe('Movie Explorer Tests', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useWatchlistStore.setState({
      watchlist: [],
      selectedGenres: [],
      searchQuery: '',
    });
    vi.clearAllMocks();
  });

  // --- Test 1: Search Debounce Hook ---
  test('should debounce input values', async () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Update the value
    rerender({ value: 'updated', delay: 500 });

    // Value should not update immediately
    expect(result.current).toBe('initial');

    // Advance time by 300ms (less than 500ms delay)
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('initial');

    // Advance remaining time by 200ms
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('updated');

    vi.useRealTimers();
  });

  // --- Test 2: Watchlist Zustand Store Actions ---
  test('should add and remove movies in the watchlist store', () => {
    const mockMovie = {
      id: 99,
      title: 'Inception',
      overview: 'Dream thief movie',
      poster_path: '/path.jpg',
      backdrop_path: '/back.jpg',
      release_date: '2010',
      vote_average: 8.8,
      vote_count: 1000,
      genre_ids: [28, 878],
    };

    const store = useWatchlistStore.getState();

    // Verify initial empty state
    expect(store.watchlist).toHaveLength(0);
    expect(store.inWatchlist(mockMovie.id)).toBe(false);

    // Add movie
    act(() => {
      useWatchlistStore.getState().addToWatchlist(mockMovie);
    });
    expect(useWatchlistStore.getState().watchlist).toHaveLength(1);
    expect(useWatchlistStore.getState().watchlist[0].movie.title).toBe('Inception');
    expect(useWatchlistStore.getState().inWatchlist(mockMovie.id)).toBe(true);

    // Remove movie
    act(() => {
      useWatchlistStore.getState().removeFromWatchlist(mockMovie.id);
    });
    expect(useWatchlistStore.getState().watchlist).toHaveLength(0);
    expect(useWatchlistStore.getState().inWatchlist(mockMovie.id)).toBe(false);
  });

  // --- Test 3: Genre Filter Component ---
  test('should toggle selected genres in the store on chip click', () => {
    // Mock the useGenres hook to return our mock list of genres
    vi.mocked(useGenres).mockReturnValue({
      data: mockGenresList,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(<GenreFilter />);

    // Check that genre chips are rendered
    const actionChip = screen.getByText('Action');
    const comedyChip = screen.getByText('Comedy');
    expect(actionChip).toBeInTheDocument();
    expect(comedyChip).toBeInTheDocument();

    // Verify initial store filter state is empty
    expect(useWatchlistStore.getState().selectedGenres).toEqual([]);

    // Click on the Action genre chip
    fireEvent.click(actionChip);

    // Selected genres should now contain the Action genre ID (28)
    expect(useWatchlistStore.getState().selectedGenres).toEqual([28]);

    // Click on the Action genre chip again (toggle off)
    fireEvent.click(actionChip);
    expect(useWatchlistStore.getState().selectedGenres).toEqual([]);
  });
});
