import { type ToastOptions, type ToastPosition, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface IUseNotify {
  notifySuccess: (message: string) => void;
  notifyError: (mesage: string) => void;
}

export const useNotify = (): IUseNotify => {
  const options: ToastOptions = {
    position: 'top-center' as ToastPosition,
    // autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    autoClose: false,
  };

  const notifySuccess = (message: string) => toast.success(message, options);

  const notifyError = (message: string) => toast.error(message, options);

  return { notifySuccess, notifyError };
};
