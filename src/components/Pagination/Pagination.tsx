import { useState, useEffect, useCallback } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import css from "./Pagination.module.css";

import type { ComponentType } from "react";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";

type ModuleWithDefault<T> = { default: T };

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

const leftArrow = <AiOutlineLeft size={16} />;
const rightArrow = <AiOutlineRight size={16} />;

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const [isLeftPressed, setIsLeftPressed] = useState<boolean>(false);
  const [isRightPressed, setIsRightPressed] = useState<boolean>(false);

  const handlePrevClick = useCallback((): void => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNextClick = useCallback((): void => {
    if (currentPage < pageCount) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, pageCount, onPageChange]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const activeElement = document.activeElement;
      if (
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (event.key === "ArrowLeft" && currentPage > 1) {
        setIsLeftPressed(true);
        handlePrevClick();
      }
      if (event.key === "ArrowRight" && currentPage < pageCount) {
        setIsRightPressed(true);
        handleNextClick();
      }
    };

    const handleKeyUp = (event: KeyboardEvent): void => {
      if (event.key === "ArrowLeft") setIsLeftPressed(false);
      if (event.key === "ArrowRight") setIsRightPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [currentPage, pageCount, handlePrevClick, handleNextClick]);

  const handlePageClick = (selectedItem: { selected: number }): void => {
    onPageChange(selectedItem.selected + 1);
  };

  return (
    <div className={css.paginationWrapper}>
      <ReactPaginate
        breakLabel="..."
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
        previousClassName={`${currentPage === 1 ? css.disabledPage : ""} ${isLeftPressed ? css.arrowPressed : ""}`}
        nextClassName={`${currentPage === pageCount ? css.disabledPage : ""} ${isRightPressed ? css.arrowPressed : ""}`}
      />
    </div>
  );
}

// import { useState, useEffect, useCallback } from "react";
// import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

// // --- бібліотека react-paginate у Vite версії 8+(специфіка)
// import ReactPaginateModule from "react-paginate";
// import type { ReactPaginateProps } from "react-paginate";
// import type { ComponentType } from "react";

// import css from "./Pagination.module.css";

// interface PaginationProps {
//   pageCount: number;
//   currentPage: number;
//   onPageChange: (selectedPage: number) => void;
// }

// export default function Pagination({
//   pageCount,
//   currentPage,
//   onPageChange,
// }: PaginationProps) {
//   // Додаємо локальні стани для відстеження натискання клавіш клавіатури
//   const [isLeftPressed, setIsLeftPressed] = useState<boolean>(false);
//   const [isRightPressed, setIsRightPressed] = useState<boolean>(false);

//   // пагінація
//   const ReactPaginate: ComponentType<ReactPaginateProps> =
//     (
//       ReactPaginateModule as unknown as {
//         default: ComponentType<ReactPaginateProps>;
//       }
//     ).default || ReactPaginateModule;

//   // Обробляємо клік попередньої сторінки
//   const handlePrevClick = useCallback((): void => {
//     if (currentPage > 1) {
//       onPageChange(currentPage - 1);
//     }
//   }, [currentPage, onPageChange]);

//   // Обробляємо клік наступної сторінки
//   const handleNextClick = useCallback((): void => {
//     if (currentPage < pageCount) {
//       onPageChange(currentPage + 1);
//     }
//   }, [currentPage, pageCount, onPageChange]);

//   // Створюємо ефект для прослуховування клавіш стрілок клавіатури,
//   // обробка події "натиснуто кнопку" (клавіша вниз) на клавіатурі
//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent): void => {
//       const activeElement = document.activeElement;
//       if (
//         activeElement?.tagName === "INPUT" ||
//         activeElement?.tagName === "TEXTAREA"
//       ) {
//         return;
//       }

//       // Перевіряємо натискання клавіш клавіатури ВЛІВО ТА ВПРАВО
//       if (event.key === "ArrowLeft" && currentPage > 1) {
//         setIsLeftPressed(true);
//         handlePrevClick();
//       }
//       if (event.key === "ArrowRight" && currentPage < pageCount) {
//         setIsRightPressed(true);
//         handleNextClick();
//       }
//     };

//     // обробка події "віджато кнопку" (клавіша вверх) на клавіатурі
//     const handleKeyUp = (event: KeyboardEvent): void => {
//       if (event.key === "ArrowLeft") setIsLeftPressed(false);
//       if (event.key === "ArrowRight") setIsRightPressed(false);
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);

//     // прибираємо слухачів подій при розмонтуванні компонента
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     };
//   }, [currentPage, pageCount, handlePrevClick, handleNextClick]);

//   // Обробляємо клік по цифрах пагінації
//   const handlePageClick = (selectedItem: { selected: number }): void => {
//     onPageChange(selectedItem.selected + 1);
//   };

//   return (
//     <div className={css.paginationWrapper}>
//       {/* пагінація З БІБЛІОТЕКИ react-paginate */}
//       <ReactPaginate
//         breakLabel="..."
//         nextLabel={
//           <span
//             onClick={(event: React.MouseEvent) => {
//               event.stopPropagation();
//               handleNextClick();
//             }}
//           >
//             <AiOutlineRight size={16} />
//             {/*стрілка з БІБЛІОТЕКИ react-icons/ai */}
//           </span>
//         }
//         previousLabel={
//           <span
//             onClick={(event: React.MouseEvent) => {
//               event.stopPropagation();
//               handlePrevClick();
//             }}
//           >
//             <AiOutlineLeft size={16} />
//             {/*стрілка з БІБЛІОТЕКИ react-icons/ai */}
//           </span>
//         }
//         onPageChange={handlePageClick}
//         pageRangeDisplayed={3}
//         marginPagesDisplayed={1}
//         pageCount={pageCount}
//         forcePage={currentPage - 1}
//         containerClassName={css.pagination}
//         activeClassName={css.active}
//         previousClassName={`${currentPage === 1 ? css.disabledPage : ""} ${isLeftPressed ? css.arrowPressed : ""}`}
//         nextClassName={`${currentPage === pageCount ? css.disabledPage : ""} ${isRightPressed ? css.arrowPressed : ""}`}
//       />
//     </div>
//   );
// }
