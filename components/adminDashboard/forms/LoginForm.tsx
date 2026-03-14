'use client';

import { type FormEvent } from 'react';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';

import { logIn } from '@store/auth/operations';
import { type AppDispatch } from '@store/store';

import { useAppDispatch } from '@hooks/useAppDispatch';

import { cn } from '@utils/cn';

const LoginForm = () => {
  const dispatch = useAppDispatch<AppDispatch>();

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
    <section className="">
      <div
        className={cn(
          'container',
          'min-h-fallback flex flex-col items-center justify-center pb-[62px] md:min-h-[84vh]!'
        )}
      >
        <h1 className="sr-only">Log in</h1>
        <form
          className="flex w-full flex-col md:max-w-[300px]"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <label className="mb-[16px] w-full">
            <span className="font-openSans text-primary text-[14px]">
              Email&nbsp;<span>*</span>
            </span>
            <div className="relative">
              <input
                className="peer border-neutral transition-border duration-primary focus:border-secondary-accent w-full rounded-[32px] border py-[14px] pr-[22px] pl-[42px] text-[14px] outline-none focus:border"
                type="email"
                name="email"
                placeholder="Enter your email"
                required
              />
              <MdEmail
                className="fill-desc peer-focus:fill-secondary-accent absolute top-1/2 left-[16px] -translate-y-1/2"
                size={18}
              />
            </div>
          </label>
          <label className="mb-[24px] w-full">
            <span className="font-openSans text-primary text-[14px]">
              Password&nbsp;<span>*</span>
            </span>
            <div className="relative">
              <input
                className="peer border-neutral transition-border duration-primary focus:border-secondary-accent w-full rounded-[32px] border py-[14px] pr-[22px] pl-[42px] text-[14px] outline-none focus:border"
                type="password"
                name="password"
                placeholder="Enter your password"
                required
              />
              <RiLockPasswordFill
                className="fill-desc peer-focus:fill-secondary-accent absolute top-1/2 left-[16px] -translate-y-1/2"
                size={18}
              />
            </div>
          </label>
          <button
            className="bg-accent font-inter text-primary transition-boxShadow hover:shadow-accent w-full rounded-[32px] py-[12px] text-[16px] leading-tight font-semibold shadow-none duration-250"
            type="submit"
          >
            Log In
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginForm;
