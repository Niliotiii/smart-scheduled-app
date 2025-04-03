import { permissionService } from '@/services/permissionService';
import { RenderPermissions } from '@/types/permissions';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

interface Team {
  id: string | number;
}

export function useRenderPermissions(
  selectedTeam?: Team | null
): UseQueryResult<RenderPermissions> {
  return useQuery<RenderPermissions>({
    queryKey: ['render', selectedTeam?.id],
    queryFn: () => permissionService.getRenderPermissions(selectedTeam?.id),
    enabled: !!selectedTeam?.id,
    staleTime: 10000,
    gcTime: 0,
    retry: (failureCount, error) => {
      return failureCount < 3 && error instanceof Error;
    },
  });
}
