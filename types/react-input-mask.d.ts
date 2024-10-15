declare module 'react-input-mask' {
  import React from 'react';

  export interface InputMaskProps {
    mask: string;
    placeholder?: string;
    maskChar?: string;
    formatChars?: { [key: string]: string };
    className?: string;
    value?: string;
    name?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  }

  const InputMask: React.FC<InputMaskProps>;
  export default InputMask;
}
