import SvgIcon from '@components/common/SvgIcon';

export interface IOption {
  value: string;
  label: JSX.Element;
}

const LanguageOption = ({ iconId, language }) => {
  return (
    <div className="flex items-center justify-center gap-[2px]">
      <SvgIcon iconId={iconId} size={{ width: 20, height: 20 }} />
      <span className="text-[12px] font-medium uppercase text-primary">
        {language}
      </span>
    </div>
  );
};

export default LanguageOption;
