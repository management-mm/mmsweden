'use client';

import {
  ChangeEvent,
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

interface Props {
  disabled?: boolean;

  onSend: (message: string) => void | Promise<unknown>;

  onPhoto: (file: File, message?: string) => void | Promise<unknown>;
}

export interface AiInputHandle {
  openFilePicker: () => void;
}

export const AiInput = forwardRef<AiInputHandle, Props>(
  ({ disabled = false, onSend, onPhoto }, ref) => {
    const [value, setValue] = useState('');

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // =====================================================
    // ALLOW PARENT TO OPEN FILE PICKER
    // =====================================================

    useImperativeHandle(
      ref,
      () => ({
        openFilePicker: () => {
          fileInputRef.current?.click();
        },
      }),
      []
    );

    // =====================================================
    // CREATE / CLEAN PREVIEW
    // =====================================================

    useEffect(() => {
      if (!selectedFile) {
        setPreviewUrl(null);

        return;
      }

      const url = URL.createObjectURL(selectedFile);

      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }, [selectedFile]);

    // =====================================================
    // SELECT PHOTO
    // =====================================================

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      setSelectedFile(file);

      event.target.value = '';
    };

    // =====================================================
    // REMOVE PHOTO
    // =====================================================

    const handleRemovePhoto = () => {
      setSelectedFile(null);
    };

    // =====================================================
    // SEND
    // =====================================================

    const handleSubmit = async (event: FormEvent) => {
      event.preventDefault();

      if (disabled) {
        return;
      }

      const text = value.trim();

      if (!text && !selectedFile) {
        return;
      }

      /*
       * PHOTO MESSAGE
       */
      if (selectedFile) {
        const file = selectedFile;

        setValue('');
        setSelectedFile(null);

        await onPhoto(file, text || undefined);

        return;
      }

      /*
       * NORMAL TEXT MESSAGE
       */
      setValue('');

      await onSend(text);
    };

    const canSend = Boolean(value.trim() || selectedFile);

    return (
      <form
        onSubmit={handleSubmit}
        className="border-t border-black/[0.05] bg-white px-3 py-3"
      >
        {/* HIDDEN FILE INPUT */}

        <input
          ref={fileInputRef}
          type="file"
          accept="
              image/jpeg,
              image/png,
              image/webp
            "
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="rounded-[24px] border border-neutral-200 bg-white p-2 shadow-[0_1px_6px_rgba(0,0,0,0.04)] transition focus-within:border-neutral-300 focus-within:shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
          {/* PHOTO PREVIEW */}

          {previewUrl && (
            <div className="mb-2 flex items-start">
              <div className="relative overflow-hidden rounded-xl border border-black/[0.06] bg-neutral-100">
                <img
                  src={previewUrl}
                  alt="Selected machine"
                  className="h-[88px] w-[110px] object-cover"
                />

                {/* REMOVE */}

                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={handleRemovePhoto}
                  className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-[16px] leading-none text-white transition hover:bg-black"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* INPUT ROW */}

          <div className="flex min-h-[48px] items-center gap-1">
            <input
              type="text"
              value={value}
              disabled={disabled}
              placeholder={
                selectedFile
                  ? 'Ask about this machine...'
                  : 'Write a question...'
              }
              onChange={event => setValue(event.target.value)}
              className="min-w-0 flex-1 border-none bg-transparent px-2 text-[14px] text-neutral-900 outline-none placeholder:text-neutral-400 disabled:cursor-not-allowed"
            />

            {/* CLIP */}

            <button
              type="button"
              aria-label="Attach image"
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 disabled:opacity-40"
            >
              <SvgIcon
                iconId={IconId.Clip}
                size={{
                  width: 20,
                  height: 20,
                }}
              />
            </button>

            {/* SEND */}

            <button
              type="submit"
              aria-label="Send message"
              disabled={disabled || !canSend}
              className="bg-secondary-accent flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-[0_3px_10px_rgba(0,0,0,0.12)] transition-all duration-150 hover:scale-[1.03] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              <SvgIcon
                iconId={IconId.Send}
                size={{
                  width: 22,
                  height: 22,
                }}
                className="fill-white"
              />
            </button>
          </div>
        </div>
      </form>
    );
  }
);

AiInput.displayName = 'AiInput';
