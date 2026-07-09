import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Movie } from "../../types/movie";
import css from "./MovieModal.module.css";

const IMAGE_MODAL_URL = "https://image.tmdb.org/t/p/original";
const PLACEHOLDER_IMG_MOD_URL = "https://placehold.net/default.png";
// "https://placehold.co/" + "600?font=source-sans-pro&text=No+poster";
// "https://placehold.co/" + "600x400/EEE/31343C?font=oswald&text=No+Poster";
// "https://placehold.co/" + "600?font=oswald&text=No+Poster";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  // Керування життєвим циклом модального вікна та глобальними подіями
  useEffect(() => {
    // Блокуємо скрол основної сторінки під модалкою
    document.body.style.overflow = "hidden";

    // Додаємо обробник події натискання клавіші (KeyboardEvent)
    // Деструктуруємо подію: витягуємо властивість 'key' (назву клавіші)
    // Якщо натиснуто клавішу Esc — ініціюємо закриття вікна
    const handleKeyDown = ({ key }: KeyboardEvent) => {
      if (key === "Escape") {
        onClose();
      }
    };

    // Вказуємо браузеру, що треба слухати натискання клавіш на всьому екрані
    window.addEventListener("keydown", handleKeyDown);

    // Очищаємо пам'ять при закритті модального вікна (Демонтуванні)
    // Повертаємо прокрутку сторінки назад у робочий стан
    // Знімаємо слухача подій, щоб не перевантажувати пам'ять браузера
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]); // Ефект перезапуститься тільки якщо зміниться функція onClose

  // Обробник події кліку миші (MouseEvent) по бекграунду / фоновому зображенню (Backdrop)
  const handleBackdropClick = ({
    target,
    currentTarget,
  }: React.MouseEvent<HTMLDivElement>) => {
    // УМОВА: Перевіряємо, чи клікнули саме на темний фон (currentTarget),
    // а не на біле вікно з контентом всередині нього (target).
    // Закриваємо модалку тільки при кліку на порожнечу навколо неї
    if (target === currentTarget) {
      onClose();
    }
  };

  // Використовуємо React Portal, щоб відрендерити модалку прямо в document.body поверх усього додатку
  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdropClick} // Вішаємо слухач на подію кліку на фон
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>
        {/* Подія кліку по кнопці-хрестику для швидкого закриття */}
        <button
          className={css.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Перевірка наявності картинки та підстановка заглушки */}
        <img
          src={
            movie.backdrop_path
              ? `${IMAGE_MODAL_URL}${movie.backdrop_path}`
              : PLACEHOLDER_IMG_MOD_URL
          }
          alt={movie.title}
          className={css.image}
        />
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    document.body, // Цільова точка для порталу в HTML
  );
};

export default MovieModal;

// ===========================================
// Модальне вікно MovieModal
// ===========================================
// Під час натискання на зображення галереї повинно відкриватися модальне вікно, яке відображатиме додаткову інформацію про фільм у великому форматі. Створіть для цього компонент MovieModal. Він має використовуватись в компоненті App та отримувати два пропси:

// movie - посилання на об’єкт обраного фільму;
// onClose - функцію закриття модального вікна.
// Компонент MovieModal має створювати DOM-елемент наступної структури:

// -------------------------------------------
// <div className={css.backdrop} role="dialog" aria-modal="true">
//   <div className={css.modal}>
//     <button className={css.closeButton} aria-label="Close modal">
//       &times;
//     </button>
//     <img
//       src="https://image.tmdb.org/t/p/original/backdrop_path"
//       alt="movie_title"
//       className={css.image}
//     />
//     <div className={css.content}>
//       <h2>movie_title</h2>
//       <p>movie_overview</p>
//       <p>
//         <strong>Release Date:</strong> movie_release_date
//       </p>
//       <p>
//         <strong>Rating:</strong> movie_vote_average/10
//       </p>
//     </div>
//   </div>
// </div>
// -------------------------------------------
// Модальне вікно має створюватись через createPortal, щоб рендерити модалку поза межами основного дерева компонентів. Воно має закриватись при кліку на кнопку з хрестиком, натисканні на клавішу ESC та при кліку за межами модального вікна. За допомогою стилів забороніть скролінг тіла сторінки, поки модалка відкрита.

// Коли модалка закривається, потрібно обов'язково чистити все, що було змінено чи додано під час її відкриття. Це включає очищення стану обраного фільму, видалення слухачів подій для клавіші Escape та відновлення прокручування тіла сторінки.
