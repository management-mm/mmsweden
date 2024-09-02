import InstructionsItem from './InstructionsItem';

import instructionsList from '@constants/instructionsList';

const Instructions = () => {
  return (
    <section className="py-[32px] text-center text-title">
      <div className="container">
        <h2 className="mb-[6px] text-[48px] font-bold">Instructions</h2>
        <p className="mb-[22px] text-[14px] font-medium text-desc">
          3 easy steps how to sell
        </p>
        <ul className="mx-auto flex flex-col gap-[12px] md:w-[calc(100%-200px)] lg:w-full lg:flex-row">
          {instructionsList.map((instructions, index) => (
            <InstructionsItem key={instructions.iconId} instructions={instructions} step={index + 1} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Instructions;
