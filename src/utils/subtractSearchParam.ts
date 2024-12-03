const subtractSearchParam = (
  searchParams: URLSearchParams,
  value: string,
  filterName: string
) => {
  const updatedParams = searchParams
    .getAll(filterName)
    .filter(item => item !== value);
  searchParams.delete(filterName);
  updatedParams.forEach(item => searchParams.append(filterName, item));
};

export default subtractSearchParam;
