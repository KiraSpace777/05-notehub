import css from "./Loader.module.css";

export default function Loader() {
  return <p className={css.text}>Loading movies, please wait...</p>;
}

// ===========================================
// Індикатор завантаження Loader
// ===========================================
// Компонент Loader має відображатись замість галереї поки відбувається запит за фільмами та створювати DOM-елемент наступної структури:
// <p className={css.text}>Loading movies, please wait...</p>
