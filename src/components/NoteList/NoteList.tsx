import { useMutation, useQueryClient } from "@tanstack/react-query";
import noteService from "../../services/noteService";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  // Ініціалізуємо QueryClient для керування глобальним кешем TanStack Query
  const queryClient = useQueryClient();
  // Підключаємо API сервіс для роботи з запитами
  const api = noteService();

  // Мутація через @tanstack/react-query для видалення та інвалідації кешу
  const deleteMutation = useMutation<Note, Error, string>({
    // При успішному видаленні автоматично оновлюємо дані на екрані
    mutationFn: (id: string) => api.deleteNote(id),
    // Маркуємо кеш під ключем 'notes' як застарілий, що змушує App зробити фоновий GET-запит
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    // Рендеримо базовий список-сітку для карток нотаток
    <ul className={css.list}>
      {/* Перебираємо масив отриманих з сервера нотаток та відмальовуємо кожну окремо */}
      {notes.map((note: Note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            {/* Візуальний тег категорії (Todo, Work, ...) */}
            <span className={css.tag}>{note.tag}</span>
            {/* Кнопка видалення картки */}
            <button
              type="button"
              className={css.button}
              // Блокуємо кнопку під час активного процесу видалення на сервері (захист від спам-кліків)
              disabled={deleteMutation.isPending}
              // Передаємо унікальний ID нотатки в метод мутації при кліку мишкою
              onClick={() => deleteMutation.mutate(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
