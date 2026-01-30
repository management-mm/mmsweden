import type { FC } from 'react';
import { SiOpenai } from 'react-icons/si';

import Loader from '@components/common/loaders/Loader';

import { generateDescWithAi } from '@store/products/operations';
import { selectIsAiGenerating } from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';

import { cn } from '@utils/cn';

interface IAiGenerateButtonProps {
  description: string;
  className?: string;
}

const AiGenerateButton: FC<IAiGenerateButtonProps> = ({
  description,
  className,
}) => {
  const loading = useAppSelector(selectIsAiGenerating);
  const dispatch = useAppDispatch();
  const handleGenerateDescWithAi = () => {
    dispatch(generateDescWithAi({ description }));
  };

  return (
    <>
      {loading && <Loader />}
      <button
        className={cn(
          'group absolute right-2 top-2 animate-rainbow cursor-pointer overflow-visible p-1 transition-all',
          'inline-flex shrink-0 items-center justify-center gap-2',
          'aria-invalid:border-destructive outline-none focus-visible:ring-[3px]',
          'whitespace-nowrap text-sm font-medium',
          'disabled:pointer-events-none disabled:opacity-50',
          "[&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
          'z-10',

          'border-input rounded-lg border border-b-transparent',
          'bg-[linear-gradient(#ffffff,#ffffff),linear-gradient(rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,#ff0000,#ff9900,#ffff00,#00ff00,#0000ff)]',
          'bg-[length:200%]',
          'text-primary-foreground',
          '[background-clip:padding-box,border-box,border-box]',
          '[background-origin:border-box]',
          '[border:calc(0.125rem)_solid_transparent]',

          'before:absolute',
          'before:inset-0',
          'before:z-10',
          'before:rounded-lg',
          'before:bg-[linear-gradient(90deg,#ff0000,#ff9900,#ffff00,#00ff00,#0000ff)]',
          'before:[filter:blur(30px)]',
          'before:animate-rainbow',
          'before:pointer-events-none',
          className
        )}
        type="button"
        onClick={handleGenerateDescWithAi}
      >
        <SiOpenai size={18} fill="black" />
      </button>
    </>
  );
};

export default AiGenerateButton;
