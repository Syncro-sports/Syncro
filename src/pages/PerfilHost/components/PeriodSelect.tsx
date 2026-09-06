import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "./icons";
import "./PeriodSelect.css";

interface PeriodOption {
  value: string;
  label: string;
}

interface PeriodSelectProps {
  value: string;
  options: PeriodOption[];
  onChange: (value: string) => void;
}

const PeriodSelect = ({ value, options, onChange }: PeriodSelectProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((option) => option.value === value);

  return (
    <div className="host-period-dropdown" ref={wrapperRef}>
      <button type="button" className="host-period-dropdown__trigger" onClick={() => setOpen((prev) => !prev)}>
        {selected?.label}
        <ChevronDownIcon />
      </button>

      {open && (
        <div className="host-period-dropdown__menu">
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              className={`host-period-dropdown__option ${option.value === value ? "is-selected" : ""}`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PeriodSelect;