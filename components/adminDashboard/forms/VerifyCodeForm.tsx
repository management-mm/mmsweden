'use client';

import {
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
  useRef,
  useState,
} from 'react';
import { MdEmail } from 'react-icons/md';
import { RiShieldCheckFill } from 'react-icons/ri';

import { useRouter } from 'next/navigation';

import { verifyTwoFactor } from '@store/auth/operations';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { useNotify } from '@hooks/useNotify';

import { getErrorMessage } from '@utils/errors/getErrorMessage';
import { logError } from '@utils/errors/logError';
import { normalizeError } from '@utils/errors/normalizeError';

const CODE_LENGTH = 6;

const VerifyCodeForm = () => {
  const { notifyError } = useNotify();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [isSubmit, setIsSubmit] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const userId = useAppSelector(state => state.auth.twoFactor.userId);
  const method = useAppSelector(state => state.auth.twoFactor.method);

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '');

    const updatedCode = [...code];

    if (!digit) {
      updatedCode[index] = '';
      setCode(updatedCode);
      return;
    }

    updatedCode[index] = digit.slice(-1);
    setCode(updatedCode);

    if (index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key !== 'Backspace') return;

    const updatedCode = [...code];

    if (code[index]) {
      updatedCode[index] = '';
      setCode(updatedCode);
      return;
    }

    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedCode = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, CODE_LENGTH)
      .split('');

    if (!pastedCode.length) return;

    const updatedCode = Array<string>(CODE_LENGTH).fill('');

    pastedCode.forEach((digit, index) => {
      updatedCode[index] = digit;
    });

    setCode(updatedCode);

    const nextIndex =
      pastedCode.length >= CODE_LENGTH ? CODE_LENGTH - 1 : pastedCode.length;

    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const verificationCode = code.join('');

    if (verificationCode.length !== CODE_LENGTH) return;

    if (!userId) {
      router.push('/login');
      return;
    }

    setIsSubmit(true);

    try {
      await dispatch(
        verifyTwoFactor({
          userId,
          code: verificationCode,
        })
      ).unwrap();
    } catch (error) {
      const normalizedError = normalizeError(error);

      logError(normalizedError, {
        scope: 'verifyTwoFactor',
        details: {
          userId,
        },
      });

      notifyError(getErrorMessage(normalizedError));
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-164px)] bg-gray-50 px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-164px)] max-w-6xl items-center justify-center">
        <div className="w-full max-w-[420px] rounded-3xl border border-gray-200 bg-white p-6 shadow-md md:p-8">
          <div className="mb-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
              <RiShieldCheckFill className="fill-secondary-accent" size={24} />
            </div>

            <h1 className="text-2xl font-semibold text-gray-900">
              Verify your email
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Enter the verification code we sent to your email address.
            </p>

            {method && (
              <p className="mt-2 text-xs text-gray-400">
                Verification method: {method}
              </p>
            )}
          </div>

          <div className="mb-6 h-px bg-gray-200" />

          <form
            className="flex w-full flex-col"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <label className="mb-6 block w-full">
              <span className="mb-3 block text-sm font-medium text-gray-700">
                Verification code <span className="text-red-500">*</span>
              </span>

              <div className="flex justify-between gap-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => {
                      inputRefs.current[index] = el;
                    }}
                    className="focus:border-secondary-accent h-12 w-full rounded-2xl border border-gray-300 bg-white text-center text-lg font-semibold text-gray-900 transition-colors duration-200 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(e.target.value, index)}
                    onKeyDown={e => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    required
                    disabled={isSubmit}
                  />
                ))}
              </div>
            </label>

            <button
              className="bg-accent text-primary w-full rounded-2xl px-4 py-3 text-base font-semibold transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              type="submit"
              disabled={isSubmit}
            >
              {isSubmit ? 'Confirming...' : 'Confirm Code'}
            </button>

            <button
              className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              disabled={isSubmit}
            >
              <MdEmail size={18} />
              Resend code
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default VerifyCodeForm;
