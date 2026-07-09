export interface Movie {
  id: number;
  poster_path: string;
  backdrop_path: string;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

// =================================
// Так буде виглядати інтерфейс для типізації одного фільму. Вносимо у файл src/types/movie.ts і використовуємо у компонентах. Відповідь від бекенду приходить об'єктом із всією необхідною інформацією, в тому числі масивом фільмів. Кожен фільм в масиві представлений об'єктом із великою кількістю інформації.
