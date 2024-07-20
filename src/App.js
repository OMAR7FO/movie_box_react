import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import NavBar from "./components/NavBar";
import NumResults from "./components/NumResults";
import Search from "./components/Search";
import Main from "./components/Main";
import WatchedList from "./components/WatchedList";
import Box from "./components/Box";
import WatchedSummary from "./components/WatchedSummary";
import MovieList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails";
import { useMovies } from "./custom_hooks/useMovies";
import { useLocalStorageState } from "./custom_hooks/useLocalStorageState";
export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, isError } = useMovies(query, handleCloseMovie);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectMove(id) {
    setSelectedId((i) => (id === i ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !isError && (
            <MovieList movies={movies} setSelectedId={handleSelectMove} />
          )}
          {isError && !isLoading && <ErrorMessage message={isError} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
