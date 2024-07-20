import { useState, useEffect } from "react";

const KEY = "a9bc709f";
export function useMovies(query, callBack) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  useEffect(
    function () {
      callBack?.();
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setIsError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) {
            throw new Error("Something went wrong while fetching movies");
          }
          const data = await res.json();
          if (data.Response === "False") {
            throw new Error("No Matched Movies");
          }
          setMovies(data.Search);
          setIsError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setIsError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (!query.length) {
        setMovies([]);
        setIsError("");
        return;
      }

      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query, callBack]
  );
  return { movies, isLoading, isError };
}
