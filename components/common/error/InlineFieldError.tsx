'use client';

type InlineFieldErrorProps = {
  message?: string | null;
  className?: string;
};

export default function InlineFieldError({
  message,
  className = '',
}: InlineFieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={`mt-1 text-[12px] leading-[1.4] text-red-600 ${className}`}
      role="alert"
      aria-live="polite"
    >
      {message}
    </p>
  );
}
