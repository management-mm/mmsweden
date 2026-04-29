'use client';

import { type FormEvent, useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { RiEyeLine, RiEyeOffLine, RiLockPasswordFill } from 'react-icons/ri';

import { logIn } from '@store/auth/operations';
import { type AppDispatch } from '@store/store';

import { useAppDispatch } from '@hooks/useAppDispatch';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const email = form.elements.namedItem('email') as HTMLInputElement;
    const password = form.elements.namedItem('password') as HTMLInputElement;

    if (email && password) {
      dispatch(
        logIn({
          email: email.value,
          password: password.value,
        })
      );
    }

    form.reset();
  };

  return (
    <section className="min-h-[calc(100vh-164px)] bg-gray-50 px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-164px)] max-w-6xl items-center justify-center">
        <div className="w-full max-w-[420px] rounded-3xl border border-gray-200 bg-white p-6 shadow-md md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Log in</h1>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Enter your email and password to access the admin panel.
            </p>
          </div>

          <div className="mb-6 h-px bg-gray-200" />

          <form
            className="flex w-full flex-col"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <label className="mb-5 block w-full">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </span>

              <div className="relative">
                <input
                  className="peer focus:border-secondary-accent w-full rounded-2xl border border-gray-300 bg-white py-3 pr-4 pl-11 text-sm text-gray-900 transition-colors duration-200 outline-none placeholder:text-gray-400"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                />

                <MdEmail
                  className="peer-focus:fill-secondary-accent pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 fill-gray-400 transition-colors duration-200"
                  size={18}
                />
              </div>
            </label>

            <label className="mb-6 block w-full">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </span>

              <div className="relative">
                <input
                  className="peer focus:border-secondary-accent w-full rounded-2xl border border-gray-300 bg-white py-3 pr-12 pl-11 text-sm text-gray-900 transition-colors duration-200 outline-none placeholder:text-gray-400"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  required
                />

                <RiLockPasswordFill
                  className="peer-focus:fill-secondary-accent pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 fill-gray-400"
                  size={18}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                >
                  {showPassword ? (
                    <RiEyeLine size={18} />
                  ) : (
                    <RiEyeOffLine size={18} />
                  )}
                </button>
              </div>
            </label>

            <button
              className="bg-accent text-primary w-full rounded-2xl px-4 py-3 text-base font-semibold transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md active:translate-y-0"
              type="submit"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
