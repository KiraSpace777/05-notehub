import { useEffect, useRef } from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (text: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  // Автоматичне повернення курсора в поле пошуку при кожному рендерингу
  useEffect(() => {
    inputRef.current?.focus();
  });

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={handleChange}
      className={css.input}
      placeholder="Search notes"
    />
  );
}
