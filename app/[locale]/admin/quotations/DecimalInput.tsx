'use client';

import { type ChangeEvent, useEffect, useRef, useState } from 'react';

interface DecimalInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  decimals?: number;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

function toDisplayValue(value: number): string {
  if (!Number.isFinite(value)) {
    return '0';
  }

  return String(value).replace('.', ',');
}

export default function DecimalInput({
  value,
  onChange,
  min = 0,
  max = 1_000_000_000,
  decimals = 2,
  className = '',
  disabled = false,
  ariaLabel,
}: DecimalInputProps) {
  const [draft, setDraft] = useState(toDisplayValue(value));

  const isEditing = useRef(false);

  // Update the input if its value changes
  // externally, for example after loading
  // an existing quotation or deal.
  useEffect(() => {
    if (!isEditing.current) {
      setDraft(toDisplayValue(value));
    }
  }, [value]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const text = event.target.value;

    const pattern =
      decimals === 0
        ? /^\d*$/
        : new RegExp(`^\\d*(?:[.,]\\d{0,${decimals}})?$`);

    if (!pattern.test(text)) {
      return;
    }

    // Keep the text exactly as typed.
    // An empty string is allowed here.
    setDraft(text);

    if (text === '' || text === ',' || text === '.') {
      return;
    }

    const parsed = Number(text.replace(',', '.'));

    if (Number.isFinite(parsed) && parsed >= min && parsed <= max) {
      onChange(parsed);
    }
  }

  function handleBlur() {
    isEditing.current = false;

    const parsed = Number(draft.replace(',', '.'));

    const fallback = min;

    const numericValue =
      draft.trim() === '' || !Number.isFinite(parsed) ? fallback : parsed;

    const factor = 10 ** decimals;

    const rounded = Math.round(numericValue * factor) / factor;

    const finalValue = Math.min(max, Math.max(min, rounded));

    setDraft(toDisplayValue(finalValue));
    onChange(finalValue);
  }

  return (
    <input
      type="text"
      inputMode={decimals === 0 ? 'numeric' : 'decimal'}
      aria-label={ariaLabel}
      autoComplete="off"
      disabled={disabled}
      value={draft}
      onFocus={event => {
        isEditing.current = true;

        // The manager can immediately
        // replace the initial zero.
        event.currentTarget.select();
      }}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
    />
  );
}
