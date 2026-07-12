import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note, CreateNoteData } from "../types/note";

// ГЛОБАЛЬНІ КОНСТАНТИ СЕРВІСУ API
const BASE_URL = "https://notehub-public.goit.study/api";
const NOTES_ENDPOINT = "/notes";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

// Типи параметрів та відповідей перенесені з глобальних типів сюди (Зауваження 1 та 2)
export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalNotes: number;
  totalPages: number;
  currentPage: number;
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

    // ВИПРАВЛЕНО: Повертає об'єкт видаленої нотатки Note за вимогами Swagger та ментора
    async deleteNote(id: string): Promise<Note> {
      const response: AxiosResponse<Note> = await noteInstance.delete<Note>(
        `${NOTES_ENDPOINT}/${id}`,
      );
      return response.data;
    },
  };
}

// ===============================================
// import axios from "axios";
// import type { AxiosResponse } from "axios";
// import type {
//   FetchNotesParams,
//   FetchNotesResponse,
//   CreateNoteData,
//   Note,
// } from "../types/note";

// // Виносимо константи строго назовні і тільки з цим єдиним URL
// const BASE_URL = "https://notehub-public.goit.study/api";
// const NOTES_ENDPOINT = "/notes";
// const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

// // Оголошуємо головну функцію сервісу з експортом за замовчуванням на початку
// export default function noteService() {
//   const noteInstance = axios.create({
//     baseURL: BASE_URL,
//     headers: {
//       Authorization: `Bearer ${TOKEN}`,
//     },
//   });

//   return {
//     async fetchNotes({
//       page,
//       perPage,
//       search,
//     }: FetchNotesParams): Promise<FetchNotesResponse> {
//       const response: AxiosResponse<FetchNotesResponse> =
//         await noteInstance.get<FetchNotesResponse>(NOTES_ENDPOINT, {
//           params: { page, perPage, search: search || undefined },
//         });
//       return response.data;
//     },

//     async createNote(noteData: CreateNoteData): Promise<Note> {
//       const response: AxiosResponse<Note> = await noteInstance.post<Note>(
//         NOTES_ENDPOINT,
//         noteData,
//       );
//       return response.data;
//     },

//     async deleteNote(id: string): Promise<{ id: string; message: string }> {
//       const response: AxiosResponse<{ id: string; message: string }> =
//         await noteInstance.delete<{ id: string; message: string }>(
//           `${NOTES_ENDPOINT}/${id}`,
//         );
//       return response.data;
//     },
//   };
// }
