import { useState, useEffect, useCallback } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

// специфіка імпорту react-paginate
import type { ComponentType } from "react";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";

import css from "./Pagination.module.css";

type ModuleWithDefault<T> = { default: T };

// Розпаковуємо дефолтний експорт react-paginate для стабільної сумісності з Vite
const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selectedPage: number) => void;
}

// ГРАФІЧНІ КОНСТАНТИ: векторні іконки "react-icons" для легкості заміни за необхідності
const leftArrow = <AiOutlineLeft size={16} />;
const rightArrow = <AiOutlineRight size={16} />;

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  // Локальні стани для відстеження натискання стрілок клавіатури (для динамічного підсвічування)
  const [isLeftPressed, setIsLeftPressed] = useState<boolean>(false);
  const [isRightPressed, setIsRightPressed] = useState<boolean>(false);

  // обробник переходу на попередню сторінку (для мишки та клавіатури)
  const handlePrevClick = useCallback((): void => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  // обробник переходу на наступну сторінку (для мишки та клавіатури)
  const handleNextClick = useCallback((): void => {
    if (currentPage < pageCount) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, pageCount, onPageChange]);

  // Ефект прослуховування подій клавіатури для навігації стрілками
  useEffect(() => {
    // Обробляємо подію keydown (кнопка натиснута), коли користувач фізично затискає стрілки вліво/вправо
    const handleKeyDown = (event: KeyboardEvent): void => {
      const activeElement = document.activeElement;
      // Блокуємо слухач подій та гортання сторінок, якщо користувач зараз пише текст в інпуті чи формі
      if (
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      // Перевіряємо натискання визначених клавіш (вліво/вправо), змінюємо стан підсвічування та гортаємо сторінку
      if (event.key === "ArrowLeft" && currentPage > 1) {
        setIsLeftPressed(true);
        handlePrevClick();
      }
      if (event.key === "ArrowRight" && currentPage < pageCount) {
        setIsRightPressed(true);
        handleNextClick();
      }
    };

    // обробляємо подію keyup (кнопка вверх - "відпустили" клавішу на клавіатурі), щоб вимкнути підсвічування
    const handleKeyUp = (event: KeyboardEvent): void => {
      if (event.key === "ArrowLeft") setIsLeftPressed(false);
      if (event.key === "ArrowRight") setIsRightPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      // Очищаємо слухачі подій при розмонтуванні компонента
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [currentPage, pageCount, handlePrevClick, handleNextClick]);

  // Обробляємо клік мишкою по конкретній цифрі сторінки (переводимо індекс 0 у сторінку 1)
  const handlePageClick = (selectedItem: { selected: number }): void => {
    onPageChange(selectedItem.selected + 1);
  };

  return (
    <div className={css.paginationWrapper}>
      <ReactPaginate
        breakLabel="..."
        // Огортаємо праву стрілку в тег і блокуємо спливання івенту для коректного кліку мишкою
        nextLabel={
          <span
            onClick={(event: React.MouseEvent) => {
              event.stopPropagation();
              handleNextClick();
            }}
          >
            {rightArrow}
          </span>
        }
        // Огортаємо ліву стрілку в тег і блокуємо спливання івенту для коректного кліку мишкою
        previousLabel={
          <span
            onClick={(event: React.MouseEvent) => {
              event.stopPropagation();
              handlePrevClick();
            }}
          >
            {leftArrow}
          </span>
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        forcePage={currentPage - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        // Динамічно додаємо класи неактивного стану або затиснутої стрілки з клавіатури
        previousClassName={`${currentPage === 1 ? css.disabledPage : ""} ${isLeftPressed ? css.arrowPressed : ""}`}
        nextClassName={`${currentPage === pageCount ? css.disabledPage : ""} ${isRightPressed ? css.arrowPressed : ""}`}
      />
    </div>
  );
}
