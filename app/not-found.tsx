import Link from 'next/link';

export default function RootNotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-xl text-center">
        <p className="mb-3 text-sm font-semibold tracking-[0.2em] uppercase">
          Error 404
        </p>

        <h1 className="mb-4 text-3xl font-semibold md:text-5xl">
          Page not found
        </h1>

        <p className="mb-8 text-base leading-7">
          The page may have been moved, renamed, or removed.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/en"
            className="bg-primary text-secondary inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
          >
            Go to homepage
          </Link>

          <Link
            href="/en/all-products"
            className="border-primary text-primary inline-flex min-h-11 items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold"
          >
            View all products
          </Link>
        </div>
      </div>
    </main>
  );
}
