  
import { createContext, ReactNode, useEffect, useState} from "react";
import { api } from "../services/api";
import { GenreResponseProps, MovieProps } from "../types";

interface MoviesContextData {
  handleClickButton(id: number): void;
  genres: GenreResponseProps[];
  movies: MovieProps[];
  selectedGenreId: number;
  selectedGenre: GenreResponseProps;
}

interface MoviesProviderProps {
  children: ReactNode;
}

export const MoviesContext = createContext({} as MoviesContextData);

export function MoviesProvider({ children }: MoviesProviderProps) {
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [genres, setGenres] = useState<GenreResponseProps[]>([]);
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      setMovies(response.data);
    });

    api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
    })
  }, [selectedGenreId]);

  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }

  return(
    <MoviesContext.Provider value={{ genres, handleClickButton, movies, selectedGenreId, selectedGenre }}>
      {children}
    </MoviesContext.Provider>
  );
}