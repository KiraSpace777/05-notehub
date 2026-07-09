import axios from "axios";
import type { Movie } from "../types/movie";

export interface MoviesData {
  results: Movie[];
  total_pages: number;
}

const API_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_TOKEN;

export const fetchMovies = async (
  query: string,
  page: number,
): Promise<MoviesData> => {
  try {
    const response = await axios.get<MoviesData>(`${API_URL}/search/movie`, {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        accept: "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.status_message || error.message, {
        cause: error,
      });
    }
    throw new Error("An unexpected error occurred", { cause: error });
  }
};

// ===============================================
// Функцію fetchMovies для виконання HTTP-запитів винесіть в окремий файл src/services/movieService.ts.
// Типізуйте її параметри, результат, який вона повертає, та відповідь від Axios.
