import { cn } from '@utils/cn';

const ErrorPage = () => {
  return (
    <div
      className={cn(
        'container',
        'flex h-screen flex-col items-center justify-center'
      )}
    >
      <h1 className="text-4xl">Oops! Something went wrong.</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

export default ErrorPage;
