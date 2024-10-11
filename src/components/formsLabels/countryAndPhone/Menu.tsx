import DecorativeLine from '@components/common/DecorativeLine';

import useOutsideAlerter from '@hooks/useOutsideAlerter';

const Menu = ({
  handleInputText,
  options,
  handleOptionClick,
  isOpen,
  setIsOpen,
}) => {
  const outsideAlerterRef = useOutsideAlerter(() => {
    console.log('click');
    if (!isOpen) return;
    setIsOpen(false);
  });
  return (
    <div
      ref={outsideAlerterRef}
      className="absolute z-10 mt-1 w-[400px] rounded-[22px] border bg-white shadow-lg"
    >
      <input
        type="text"
        className="w-full rounded-[32px] border border-[rgba(102,102,102,0.22)] bg-white py-[10px] pl-[16px] pr-[18px] font-openSans text-[12px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent"
        placeholder="Search by Name or Code"
        onInput={handleInputText}
      />
      <ul className="mb-[22px] mt-[14px] max-h-60 overflow-auto bg-white">
        {options.length > 0 ? (
          options.map(option => (
            <li
              key={option.value}
              className="duration-250 cursor-pointer p-2 transition-colors hover:bg-secondary"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))
        ) : (
          <li className="p-2 text-gray-500">No options found</li>
        )}
      </ul>
    </div>
  );
};

export default Menu;
