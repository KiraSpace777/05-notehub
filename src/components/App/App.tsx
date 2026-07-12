//=== Імпорт зовнішніх бібліотек (npm install) ====
import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

//=== Імпорт модулів / Components =================
import noteService from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

//=== Імпорт модулів / SRC =========================
import type {
  FetchNotesResponse,
  Note,
  CreateNoteData,
} from "../../types/note";

//=== Імпорт стилів ================================
import css from "./App.module.css";

const noteApiInfo = "https://notehub-public.goit.study/api/docs/#/";

//=== Головний компонент додатку ====================
export default function App() {
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(10);

  const [search, setSearch] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const api = noteService();

  const { data, isLoading, isError, isFetching } = useQuery<
    FetchNotesResponse,
    Error
  >({
    queryKey: ["notes", { page, perPage, search }],
    queryFn: () => api.fetchNotes({ page, perPage, search }),
    placeholderData: keepPreviousData,
    staleTime: 2000,
  });

  // staleTime
  // Дані вважаються «свіжими» (fresh) протягом 2 секунд (2000 мілісекунд) після їх успішного отримання з сервера NoteHub. Якщо користувач протягом цих 2 секунд виконає будь-яку дію, яка зазвичай змушує React Query робити повторний фоновий запит на сервер (наприклад, випадково клікне мишкою повз вікно і повернеться назад, або відкриє/закриє модалку форми), бібліотека не буде робити новий мережевий запит. Вона миттєво віддасть дані з локального кешу.Як тільки 2 секунди минають, дані автоматично переходять у статус «застарілих» (stale). Тепер при будь-якій зміні фокусу екрана React Query запустить тихий фоновий запит (isFetching), щоб перевірити, чи не змінилося щось на сервері

  const createMutation = useMutation<Note, Error, CreateNoteData>({
    mutationFn: (newNote: CreateNoteData) => api.createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation<
    { id: string; message: string },
    Error,
    string
  >({
    mutationFn: (id: string) => api.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  // Затримка у 2000мс на відправку запиту до сервера
  const debouncedSetSearch = useDebouncedCallback((value: string): void => {
    setSearch(value);
    setPage(1); // Завжди скидаємо на 1 сторінку при пошуку

    if (value !== "") {
      setInputValue("");
    }
  }, 2000);

  const searchChangeHandler = (text: string): void => {
    setInputValue(text);
    debouncedSetSearch(text);
  };

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage />;

  const notesList: Note[] = data?.notes ?? [];
  const totalPages: number = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onChange={searchChangeHandler} />
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button
          type="button"
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {totalPages > 0 && (
        <p className={css.infoText}>
          Current page: {page} of {totalPages}
        </p>
      )}

      {/* Згладжування плавності завантаження через зміну прозорості в CSS модулі */}
      <main className={isFetching ? css.contentLoading : css.mainContent}>
        {notesList.length > 0 ? (
          <NoteList
            notes={notesList}
            onDelete={(id: string) => deleteMutation.mutate(id)}
          />
        ) : (
          /* Повідомлення про порожній результат пошуку */
          <p className={css.notFoundText}>
            No notes found on your search query:
            <strong>
              " <u>{search}</u> "
            </strong>
            , try new search
          </p>
        )}
      </main>

      <footer>
        <p>
          Powered by <a href={noteApiInfo}>NoteHub API</a>
        </p>
      </footer>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onSubmit={(formData: CreateNoteData) =>
            createMutation.mutate(formData)
          }
          onClose={() => setIsModalOpen(false)}
          isPending={createMutation.isPending}
        />
      </Modal>
    </div>
  );
}
