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
    <div className="stack">
      <label style={{fontWeight:600}}>{label}</label>
      <input
        className="input"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) {
            onSubmit();
          }
        }}
        aria-label={label}
      />
    </div>
  );
}
