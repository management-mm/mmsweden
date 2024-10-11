const MobileMenuSelect = ({ handleInputText, options, handleOptionClick }) => {
  return (
    <div className="z-10 mt-1 w-full">
      <input
        type="text"
        className="w-[calc(100%-50px)] rounded-[32px] border border-[rgba(102,102,102,0.22)] bg-transparent py-[10px] pl-[16px] pr-[18px] font-openSans text-[12px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent"
        placeholder="Search by Name or Code"
        onInput={handleInputText}
      />
      <ul className="scrollbar-none my-[14px] max-h-[calc(70vh)] overflow-auto">
        {options.length > 0 ? (
          options.map(option => (
            <li
              key={option.value}
              className="cursor-pointer border-t p-2 hover:bg-gray-200"
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

export default MobileMenuSelect;
