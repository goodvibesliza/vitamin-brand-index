import React from "react";

export default function SearchBar({
  label,
  placeholder,
  value,
  onChange,
  onSubmit,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
}) {
  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <label style={{ fontWeight: 600 }}>{label}</label>
      <input
        className="input"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      />
    </form>
  );
}
