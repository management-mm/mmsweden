import type { FC } from 'react';

interface IDescProps {
  text: string;
}

const Desc: FC<IDescProps> = ({ text }) => {
  return (
    <p className="font-openSans text-desc mb-[12px] text-[12px]">{text}</p>
  );
};

export default Desc;
