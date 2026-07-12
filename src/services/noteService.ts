import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note, CreateNoteData } from "../types/note";

// ГЛОБАЛЬНІ КОНСТАНТИ СЕРВІСУ API
const BASE_URL = "https://notehub-public.goit.study/api";
const NOTES_ENDPOINT = "/notes";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

// визначення основних типів параметрів та відповідей (інтерфейси, типізація)
export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export default function noteService() {
  const noteInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return {
    async fetchNotes({
      page,
      perPage,
      search,
    }: FetchNotesParams): Promise<FetchNotesResponse> {
      const response: AxiosResponse<FetchNotesResponse> =
        await noteInstance.get<FetchNotesResponse>(NOTES_ENDPOINT, {
          params: { page, perPage, search: search || undefined },
        });
      return response.data;
    },

    async createNote(noteData: CreateNoteData): Promise<Note> {
      const response: AxiosResponse<Note> = await noteInstance.post<Note>(
        NOTES_ENDPOINT,
        noteData,
      );
      return response.data;
    },

    // Повернення об'єкту видаленої нотатки "Note": коли додаток відправляє запит на видалення нотатки, сервер NoteHub у відповідь повертає повний об'єкт цієї нотатки, яку щойно видалили (з її ID, заголовком, текстом і тегом).
    async deleteNote(id: string): Promise<Note> {
      const response: AxiosResponse<Note> = await noteInstance.delete<Note>(
        `${NOTES_ENDPOINT}/${id}`,
      );
      return response.data;
    },
  };
}
