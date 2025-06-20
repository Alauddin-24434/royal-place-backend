export const buildQueryFilters = (
  query: Record<string, any>,
  filterMap: Record<string, string>
): Record<string, any> => {
  const filters: Record<string, any> = {};

  for (const key in filterMap) {
    const value = query[key];

    // Skip undefined or empty string values
    if (value !== undefined && value !== "") {
      filters[filterMap[key]] = value;
    }
  }

  return filters;
};