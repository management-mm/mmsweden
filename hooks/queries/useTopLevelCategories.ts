import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { getTopLevel } from '@api/categoriesService';
import { ISeoCategory } from '@interfaces/ISeoCategory';

export function useTopLevelCategories(): UseQueryResult<ISeoCategory[], Error> {
  return useQuery<ISeoCategory[], Error>({
    queryKey: ['categories', 'top-level'],
    queryFn: () => getTopLevel(),
    staleTime: 1000 * 60 * 10,
  });
}
