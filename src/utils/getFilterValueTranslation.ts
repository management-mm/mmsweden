import findTranslation from './findTranslation';

const getFilterValueTranslation = (
  filter,
  categories,
  industries,
  language
) => {
  const { filterName, value } = filter;

  const itemCollections = {
    category: categories,
    industry: industries,
  };

  const items = itemCollections[filterName];

  console.log(items);

  return items ? findTranslation(items, value, language) : value;
};

export default getFilterValueTranslation;
