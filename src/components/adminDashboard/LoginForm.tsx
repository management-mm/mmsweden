import { type FormEvent } from 'react';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';

import { logIn } from '@store/auth/operations';
import { type AppDispatch } from '@store/store';

const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();

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
    <section className="pt-[25vh]">
      <h1 className="sr-only">Log in</h1>
      <form
        className="mx-auto flex max-w-[300px] flex-col"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <label className="mb-[16px] w-full">
          <span className="font-openSans text-[14px] text-primary">
            Email&nbsp;<span>*</span>
          </span>
          <div className="relative">
            <input
              className="peer w-full rounded-[32px] border border-neutral py-[14px] pl-[42px] pr-[22px] text-[14px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent"
              type="email"
              name="email"
              placeholder="Enter your email"
              required
            />
            <MdEmail
              className="absolute left-[16px] top-1/2 -translate-y-1/2 fill-desc peer-focus:fill-secondaryAccent"
              size={18}
            />
          </div>
        </label>
        <label className="mb-[24px] w-full">
          <span className="font-openSans text-[14px] text-primary">
            Password&nbsp;<span>*</span>
          </span>
          <div className="relative">
            <input
              className="peer w-full rounded-[32px] border border-neutral py-[14px] pl-[42px] pr-[22px] text-[14px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent"
              type="password"
              name="password"
              placeholder="Enter your password"
              required
            />
            <RiLockPasswordFill
              className="absolute left-[16px] top-1/2 -translate-y-1/2 fill-desc peer-focus:fill-secondaryAccent"
              size={18}
            />
          </div>
        </label>
        <button
          className="duration-250 w-full rounded-[32px] bg-accent py-[12px] font-inter text-[16px] font-semibold leading-tight text-primary shadow-none transition-boxShadow hover:shadow-accent"
          type="submit"
        >
          Log In
        </button>
      </form>
    </section>
  );
};

export default LoginForm;
