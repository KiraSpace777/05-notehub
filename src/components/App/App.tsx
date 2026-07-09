// =======================================================
// ===== refactoring "React Query" and pagination ========
// =======================================================

//=== Імпорт зовнішніх бібліотек (npm install) ====
import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";

//--- бібліотека react-paginate у Vite версії 8+(специфіка)
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

//=== Імпорт модулів / Components =================
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import SearchBar from "../SearchBar/SearchBar";

//=== Імпорт модулів / SRC =========================
import { fetchMovies, type MoviesData } from "../../services/movieService";
import type { Movie } from "../../types/movie";

import css from "./App.module.css";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

function App() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isSuccess, isError, error, isFetching, dataUpdatedAt } =
    useQuery<MoviesData>({
      queryKey: ["movies", query, page],
      queryFn: () => fetchMovies(query, page),
      enabled: query.length > 0,
      placeholderData: keepPreviousData,
    });

  const movies: Movie[] = data?.results ?? [];
  const totalPages: number = data?.total_pages ?? 0;

  // ОБРОБКА ПОМИЛОК СЕРВЕРА ТА ПОРОЖНІХ РЕЗУЛЬТАТІВ
  useEffect(() => {
    // Якщо зараз іде активне завантаження в мережі або сторінка тільки завантажилась, не видаємо помилки
    if (query === "" || isFetching) return;

    // Стан помилки №1: Завантаження закінчилось, статус успішний, але масив порожній
    if (isSuccess && movies.length === 0) {
      toast.error("No movies found for your search query.");
    }

    // Стан помилки №2: Завантаження закінчилось технічним збоєм (CORS / 502)
    if (isError && error) {
      const errorMessage =
        error instanceof Error ? error.message : "Network error";
      toast.error(`Server Error: ${errorMessage}`);
    }
  }, [
    isSuccess,
    isError,
    isFetching,
    movies.length,
    query,
    error,
    dataUpdatedAt,
  ]);

  // Керування пагінацією за допомогою стрілок клавіатури
  useEffect(() => {
    if (totalPages <= 1 || selectedMovie) return;

    const handleKeyDown = ({ key }: KeyboardEvent) => {
      if (key === "ArrowRight") {
        setPage((prev) => (prev < totalPages ? prev + 1 : prev));
      } else if (key === "ArrowLeft") {
        setPage((prev) => (prev > 1 ? prev - 1 : prev));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalPages, selectedMovie]);

  // БАЗОВА ЛОГІКА ПОШУКУ
  const handleSearch = (newQuery: string): void => {
    setQuery(newQuery);
    setPage(1);

    // Плавний скрол угору при старті нового пошуку
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openModal = (movie: Movie): void => {
    setSelectedMovie(movie);
    document.body.style.overflow = "hidden";
  };
  const closeModal = (): void => {
    setSelectedMovie(null);
    document.body.style.overflow = "unset";
  };

  const ARROW_LEFT_CHAR = "←";
  const ARROW_RIGHT_CHAR = "→";

  return (
    <div className={css.app}>
      {/* Налаштування Toaster через zIndex */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={24}
        containerStyle={{ zIndex: 99999 }}
      />
      <SearchBar onSubmit={handleSearch} isLoading={isFetching} />

      {isFetching && <Loader />}
      {isError && <ErrorMessage />}

      {movies.length === 0 && !isFetching && !isError && (
        <h5 className={css.infoTitle}>
          Enter your query in the search field to get started
        </h5>
      )}

      {isSuccess && movies.length > 0 && !isError && (
        <div className={isFetching ? css.fetching : undefined}>
          <MovieGrid movies={movies} onSelect={openModal} />

          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              previousClassName={css.prevBtn}
              nextClassName={css.nextBtn}
              previousLabel={ARROW_LEFT_CHAR}
              nextLabel={ARROW_RIGHT_CHAR}
            />
          )}
        </div>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}
export default App;

// =======================================================
// ====== HW-04 - before refactoring and pagination ======
// =======================================================
//=== Імпорт зовнішніх бібліотек (npm install) ====
// import { useState } from "react";
// import { Toaster, toast } from "react-hot-toast";
//=== Імпорт модулів / Components =================
// import ErrorMessage from "../ErrorMessage/ErrorMessage";
// import Loader from "../Loader/Loader";
// import MovieGrid from "../MovieGrid/MovieGrid";
// import MovieModal from "../MovieModal/MovieModal";
// import SearchBar from "../SearchBar/SearchBar";
//=== Імпорт модулів / SRC =========================
// import { fetchMovies } from "../../services/movieService";
// import type { Movie } from "../../types/movie";
// import css from "./App.module.css";

// function App() {
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

//   const handleSearch = async (query: string) => {
//     setIsLoading(true);
//     setError(null);
//     setMovies([]);
//     setSelectedMovie(null);

//     try {
//       const data = await fetchMovies(query);

//       if (data.results.length === 0) {
//         toast.error("No movies found for your request.");
//         setMovies([]);
//       } else {
//         setMovies(data.results);
//       }
//     } catch {
//       setError("Failed to fetch movies");
//       toast.error("Failed to fetch movies. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const matchSelectedMovie = (movie: Movie) => {
//     setSelectedMovie(movie);
//   };

//   const matchCloseModal = () => {
//     setSelectedMovie(null);
//   };

//   return (
//     <div className={css.app}>
//       <Toaster
//         position="top-center"
//         reverseOrder={false}
//         containerStyle={{
//           top: 12,
//         }}
//       />
//       <SearchBar onSubmit={handleSearch} />
//       <main className={css.main}>
//         {isLoading && <Loader />}
//         {error && !isLoading && <ErrorMessage />}
//         {!isLoading && !error && movies.length > 0 && (
//           <MovieGrid movies={movies} onSelect={matchSelectedMovie} />
//         )}
//         {!isLoading && !error && movies.length === 0 && (
//           <h5>Enter your query in the search field to get started</h5>
//         )}
//         {selectedMovie && (
//           <MovieModal movie={selectedMovie} onClose={matchCloseModal} />
//         )}
//       </main>
//     </div>
//   );
// }

// export default App;
