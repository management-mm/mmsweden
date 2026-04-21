import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { getChildren } from '@api/categoriesService';
import { ISeoCategory } from '@interfaces/ISeoCategory';

export function useChildCategories(
  parentId: string | null
): UseQueryResult<ISeoCategory[], Error> {
  return useQuery<ISeoCategory[], Error>({
    queryKey: ['categories', 'children', parentId],
    queryFn: () => getChildren(parentId!),
    enabled: !!parentId,
    staleTime: 1000 * 60 * 10,
  });
}
