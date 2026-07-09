import type { Movie } from "../../types/movie";
import css from "./MovieGrid.module.css";

const API_IMG_URL = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER_IMG_URL = "https://placehold.net/default.png";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <ul className={css.grid}>
      {movies.map((movie) => (
        <li key={movie.id}>
          <div className={css.card}>
            <img
              className={css.image}
              src={
                movie.poster_path
                  ? `${API_IMG_URL}${movie.poster_path}`
                  : PLACEHOLDER_IMG_URL
              }
              alt={movie.title}
              loading="lazy"
              onClick={() => onSelect(movie)}
            />
            <h2 className={css.title}>{movie.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}

// ===========================================
// Галерея фільмів MovieGrid
// ===========================================
// Компонент MovieGrid – це список карток фільмів. Він приймає два пропси:
// onSelect – функцію для обробки кліку на картку фільму;
// movies – масив фільмів.
// Компонент MovieGrid має створювати DOM-елемент наступної структури:
// ------------------------------------------
// <ul className={css.grid}>
//   {/* Набір елементів списку з фільмами */}
//   <li>
//     <div className={css.card}>
//       <img
// 		    className={css.image}
// 		    src="https://image.tmdb.org/t/p/w500/poster-path"
// 		    alt="movie title"
// 		    loading="lazy"
// 		  />
// 	    <h2 className={css.title}>Movie title</h2>
//     </div>
//   </li>
// </ul>
// ------------------------------------------
// Галерея повинна рендеритися лише тоді, коли є які-небудь завантажені фільми.
