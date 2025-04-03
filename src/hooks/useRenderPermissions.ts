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
    queryFn: () => {
      if (!selectedTeam?.id) {
        return permissionService.getRenderPermissions();
      }
      return permissionService.getRenderPermissions(selectedTeam.id);
    },
    refetchInterval: 30000,
    enabled: true,
    staleTime: 25000,
    gcTime: 60000,
  });
}
