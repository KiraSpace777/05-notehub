// Обмеження для вибору тегів
export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

// Інтерфейс нотатки
export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

// Типізація параметрів для виконання запиту на пошук нотатків
export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

// Типізація відповіді від сервера щодо пошуку нотатків
export interface FetchNotesResponse {
  notes: Note[];
  totalNotes: number;
  totalPages: number;
  currentPage: number;
}

// Типізація даних для створення нової нотатки
export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}
