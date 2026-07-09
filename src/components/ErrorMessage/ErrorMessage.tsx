import css from "./ErrorMessage.module.css";

export default function ErrorMessage() {
  return <p className={css.text}>There was an error, please try again...</p>;
}

// import css from "./ErrorMessage.module.css";

// export default function ErrorMessage() {
//   return <p className={css.text}>There was an error, please try again...</p>;
// }

// ===========================================
// Повідомлення про помилку ErrorMessage
// ===========================================
// Компонент ErrorMessage має рендеритися замість галереї фільмів у випадку помилки HTTP-запиту та створювати DOM-елемент наступної структури:
// <p className={css.text}>There was an error, please try again...</p>
