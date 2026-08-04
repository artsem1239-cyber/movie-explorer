# Movie Explorer Challenge 🎬

A modern, responsive Single Page Application (SPA) designed to let users explore movies, perform debounced searches, filter by multiple genres, and maintain a locally-persisted custom watchlist.

Built with **React 18+**, **TypeScript**, **Tailwind CSS**, **Zustand**, and **TanStack Query (React Query) v5**.

**Live demo:** https://movie-explorer-two-rose.vercel.app

---

## Features & Highlights

- **Browse Popular Movies**: Experience endless lists with integrated infinite scroll features.
- **Debounced Search**: Perform instant searches by title using debounced inputs to preserve API bandwidth.
- **Multi-Genre Filters**: Select multiple genres simultaneously to narrow down choices.
- **Synced Watchlist**: Keep your watchlist safe in `localStorage` with sort options (by added date or overall rating).
- **Details Dialog**: Interactive overlays presenting movie runtimes, full synopses, and generic metadata.
- **Graceful Fallbacks & Demo Mode**: The application detects if no TMDB API key is available and switches automatically to a **Demo Mode** with fully-functional mock data (no crashes!).
- **Accessibility & Contrast**: Keyboard navigable, dialog controls (Escape-key close), image labels (`alt` texts), and semantic HTML layout.

---

## Architecture & Technical Decisions

### 📁 Folder Structure
The workspace is structured cleanly following standard React practices:
```text
src/
├── assets/         # CSS templates, images, and static graphics
├── components/     # Reusable presentational components (Navbar, MovieCard, GenreFilter, etc.)
├── hooks/          # Custom utility and API queries hooks (useDebounce, useMovies)
├── pages/          # Layout page containers (Browse, Watchlist)
├── services/       # TMDB fetch client and mock data fallback
├── store/          # Zustand global store configuration
└── types/          # Core TypeScript declarations
```

### ⚡ State Management
We use **Zustand** as our primary global state management solution.
- *Why Zustand?* It is extremely lightweight (less than 1KB), has zero boilerplate compared to Redux, and offers out-of-the-box middleware such as `persist` (simplifying `localStorage` syncing for our Watchlist).
- *Boundary definition*: Local visual states (like modal visibility) remain within local component states (`useState`), while global query entries and selected genre filters are kept in Zustand to allow cross-tab integration.

### 📡 Data Fetching
We choose **TanStack React Query v5** to manage client caching, queries, and background sync.
- *Caching Strategy*: Data fetching triggers are optimized with custom `staleTime` values (e.g. popular lists cached for 5 mins, genres for 24 hours).
- *Pagination*: Built on top of React Query's `useInfiniteQuery` supporting clean infinite scrolling triggers.

### 🎨 Styling Strategy
**Tailwind CSS v3** was selected to craft a premium, dark-mode cinematic interface. Custom configurations include:
- Glassmorphism surfaces (`glass-panel` and `glass-modal`) utilizing backdrop blurs.
- Brand palettes focusing on deep slate blues and neon indigo highlights.
- Smooth transition animations (fade-in, scale-up).

---

## Getting Started

### 📋 Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (LTS version recommended, v22+).

### ⚙️ Installation
1. Clone this repository to your local machine:
   ```bash
   git clone <repository-url>
   cd movie
   ```
2. Install the project dependencies:
   ```bash
   npm install
   ```

### 🔑 Setting up the API Key
1. Obtain a free API key or Access Token from [The Movie Database (TMDB)](https://developer.themoviedb.org).
2. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open the `.env` file and insert your API key:
   ```env
   VITE_TMDB_API_KEY=your_actual_tmdb_api_key_here
   ```
   *Note: If no API key is specified, the application will automatically fallback to a mock database, showing a banner "Using Demo Mode".*

### 🚀 Running the App
Start the development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 🧪 Running Tests
We use **Vitest** + **React Testing Library** to verify core functionalities. To execute the test suite:
```bash
npm test
```
The test suite validates:
1. **Search Debounce**: Assures text input holds off fetches during active typing.
2. **Watchlist CRUD**: Verifies items addition, containment checks, and removals in the Zustand store.
3. **Genre Filter**: Assures genre chip clicks toggle store states correctly.

---

## Trade-offs & Future Steps

### Trade-offs
- **Client-Side Genre Filtering**: For simplicity, filtering movies by genre is done on the client-side using the retrieved pages. This means if you filter by "Animation" on page 1, and no animation movies are returned in page 1's popular movies, you may see an empty grid until page 2 is fetched. 
  - *Mitigation*: We could fetch more pages or use TMDB's `/discover/movie` API endpoint with the `with_genres` parameter to offload filtering to the server. For the scale of this coding challenge, client filtering was preferred for speed and simple UX interactions.

### Future Steps & Improvements
- **IntersectionObserver pagination fine-tuning**: Add visual skeletons when next pages are actively downloading on slower connections.
- **Trailer Integration**: Fetch `/movie/{id}/videos` to render movie trailers in the details modal.
- **Watchlist reordering**: Add drag-and-drop to let users reorder their watchlist manually.
