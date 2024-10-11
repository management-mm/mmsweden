const getProductName = (name, language) =>
  typeof name === 'object' ? name?.[language] : name;

export default getProductName;
