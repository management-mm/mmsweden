import type { FC } from 'react';

interface IDescProps {
  text: string;
}

const Desc: FC<IDescProps> = ({ text }) => {
  return (
    <p className="mb-[12px] font-openSans text-[12px] text-desc">{text}</p>
  );
};

export default Desc;
