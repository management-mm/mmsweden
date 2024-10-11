const findTranslation = (items, value, language) => {
  const valueObject = items.find(item => item.name.en === value);
  return valueObject ? valueObject.name[language] : value;
};

export default findTranslation;
