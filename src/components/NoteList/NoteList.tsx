import { useMutation, useQueryClient } from "@tanstack/react-query";
import noteService from "../../services/noteService";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const api = noteService();

  // ВИПРАВЛЕНО: Мутація видалення та інвалідація кешу тепер знаходяться всередині NoteList
  const deleteMutation = useMutation<Note, Error, string>({
    mutationFn: (id: string) => api.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note: Note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              type="button"
              className={css.button}
              disabled={deleteMutation.isPending}
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

// ================================
// import type { Note } from "../../types/note";
// import css from "./NoteList.module.css";

// interface NoteListProps {
//   notes: Note[];
//   onDelete: (id: string) => void;
// }

// export default function NoteList({ notes, onDelete }: NoteListProps) {
//   return (
//     <ul className={css.list}>
//       {notes.map((note: Note) => (
//         <li key={note.id} className={css.listItem}>
//           <h2 className={css.title}>{note.title}</h2>
//           <p className={css.content}>{note.content}</p>

//           <div className={css.footer}>
//             <span className={css.tag}>{note.tag}</span>
//             <button
//               type="button"
//               className={css.button}
//               onClick={() => onDelete(note.id)}
//             >
//               Delete
//             </button>
//           </div>
//         </li>
//       ))}
//     </ul>
//   );
// }
