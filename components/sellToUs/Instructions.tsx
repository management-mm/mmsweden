import { useTranslations } from 'next-intl';

import InstructionsItem from './InstructionsItem';

import { Description, Title } from '@enums/i18nConstants';

import instructionsList from '@constants/instructionsList';

const Instructions = () => {
  const t = useTranslations();

  return (
    <section className="text-title py-[32px] text-center">
      <div className="container">
        <h2 className="mb-[6px] text-[48px] font-bold">
          {t(Title.Instructions)}
        </h2>
        <p className="text-desc mb-[22px] text-[14px] font-medium">
          {t(Description.Instructions)}
        </p>
        <ul className="mx-auto flex flex-col gap-[12px] md:w-[calc(100%-200px)] lg:w-full lg:flex-row">
          {instructionsList.map((instructions, index) => (
            <InstructionsItem
              key={instructions.iconId}
              instructions={instructions}
              step={index + 1}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Instructions;
