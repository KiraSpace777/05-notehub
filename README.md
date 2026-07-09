<!-- ================================================ -->
<!-- additional npm install -->
<!-- ================================================ -->

https://tanstack.com/query/latest

<!-- npm i @tanstack/react-query -->

ESLint Plugin Query

<!-- npm i -D @tanstack/eslint-plugin-query -->

Бібліотека react-paginate у Vite версії 8+(специфіка)

<!-- npm i react-paginate -->

<!-- bash
<!-- npm install
@tanstack/react-query axios react-hot-toast react-paginate modern-normalize -->
<!-- npm install
-D @types/react-paginate @tanstack/react-query-devtools prettier --> -->

======= МОДУЛЬ 4: React Query, Бібліотека Formik ========
====================== Домашнє завдання №4 ==============

Створено репозиторій 04-react-query
При здачі роботи надаються два посилання: на вихідні файли (репозиторій) та на робочу сторінку завдання, розгорнуту на Vercel.
Проєкт створено за допомогою Vite.
Під час запуску коду в консолі не повинно бути помилок або попереджень.
Для кожного компонента у папці src/components має бути окрема папка, яка містить файл самого React компонента та файл його стилів. Назва папки, файлу компонента (з розширенням .tsx) та файлу стилів (перед .module.css) однакова і відповідає назвам, вказаним у завданнях (якщо вони були).
У кожній папці компонента мають бути:
Файл компонента з розширенням .tsx (наприклад, App.tsx);
Файл стилів, назва якого закінчується на .module.css, з такою самою назвою (наприклад, App.module.css).
Для експорту компонентів використовується експорт за замовчуванням (export default).
Загальні типи, які використовуються в кількох компонентах, винесені в окремий файл (src/types/movie.ts). Типи та інтерфейси, які стосуються лише одного компонента, оголошені безпосередньо у файлі цього компонента.
Для типізації пропсів компонентів використовується interface.
Інтерфейс для пропсів компонента називається за схемою: Ім’яКомпонентаProps (наприклад, UserCardProps).
Усі події компонентів типізовані.
Для виконання HTTP-запитів використовується бібліотека axios.
TypeScript-код має бути чистим, зрозумілим і відформатованим за допомогою Prettier.
Стилізація виконується за допомогою CSS-модулів.
Використовується modern-normalize для уніфікації стилів у різних браузерах.

==================== Пошук фільмів ====================

Доповни свій застосунок пошуку фільмів пагінацією. Подивіться демо-відео роботи застосунку.

Для збереження колекції відповідей від бекенду та керування станом запитів використовуйте бібліотеку TanStack Query.

<!-- https://tanstack.com/query/latest -->

Installation:

<!-- npm i @tanstack/react-query -->

Recommendations# :
It is recommended to also use our ESLint Plugin Query to help you catch bugs and inconsistencies while you code. You can install it via:

<!-- npm i -D @tanstack/eslint-plugin-query -->

------------ Налаштування DevTools -----------

React Query Devtools – це потужний інструмент для моніторингу і налагодження запитів та кешування в реальному часі. Він дозволяє переглядати запити, їхні стани, дані, помилки та багато іншого прямо в браузері.
Щоб додати DevTools, спершу потрібно його встановити:

<!-- npm install @tanstack/react-query-devtools -->

Необхідно зробити рефакторинг логіки отримання і збереження фільмів, а також відповідних станів. Не забудь, що налаштування роботи клієнта react-query потрібно робити на верхньому рівні, тобто у файлі src/main.tsx, а використовувати відповідні хуки безпосередньо в тому компоненті, де необхідна обробка отриманих даних – у нашому випадку, у компоненті App.

<!-- import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { getTodos, postTodo } from '../my-api'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  )
}

function Todos() {
  // Access the client
  const queryClient = useQueryClient()

  // Queries
  const query = useQuery({ queryKey: ['todos'], queryFn: getTodos })

  // Mutations
  const mutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return (
    <div>
      <ul>
        {query.data?.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now(),
            title: 'Do Laundry',
          })
        }}
      >
        Add Todo
      </button>
    </div>
  )
}

render(<App />, document.getElementById('root')) -->

==================== Пагінація фільмів ====================

Сервіс TMDB підтримує пагінацію, для цього вам потрібно передати у http-запиті додатково параметр page.

Тепер у відповідь бекенду вас буде цікавити не лише властивість results, а і total_page. Тому не забудьте оновити інтерфейс для типізації відповіді з бекенду.

Для відображення елементів пагінації використовуйте бібліотеку React Paginate. Зверніть увагу, що вона містить готовий компонент пагінації, але без стилів. Тому додайте підготовлені нами стилі для неї у файл App.module.css:

<!-- .pagination {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin: 16px 0;
    list-style: none;
    padding: 0;
}

.pagination li {
    width: 40px;
    height: 40px;
    border: 1px solid #ccc;
    cursor: pointer;
    border-radius: 4px;
}

.pagination a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.active {
    background-color: #0a66c2;
    color: white;
    font-weight: bold;
} -->

Зверніть увагу, що є особливість імпорту бібліотеки react-paginate у Vite версії 8+. Для правильного імпорту та типізації використайте наступний код:

<!--
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default; -->

// Далі в jsx використовуємо компонент ReactPaginate звичайним чином.
Компоненту ReactPaginate передайте наступні пропси:

<!-- pageCount={totalPages}
pageRangeDisplayed={5}
marginPagesDisplayed={1}
onPageChange={({ selected }) => setPage(selected + 1)}
forcePage={page - 1}
containerClassName={css.pagination}
activeClassName={css.active}
nextLabel="→"
previousLabel="←" -->

Пагінація має рендеритися лише тоді, коли кількість сторінок із завантаженими фільмами більше ніж 1.

<!-- ====================================================== -->

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
