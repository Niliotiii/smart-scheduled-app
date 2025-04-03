import { useAuth } from '@/contexts/AuthContext';
import { RolePermissions, TeamRulePermissions } from '@/types/permissions';
import { useRenderPermissions } from './useRenderPermissions';

type PermissionType = keyof RolePermissions | keyof TeamRulePermissions;

export function useActionPermissions() {
  const { selectedTeam } = useAuth();
  const { data: permissions } = useRenderPermissions(selectedTeam);

  const hasPermission = (permission: PermissionType): boolean => {
    if (!permissions) return false;

    return (
      (permission in permissions.rolePermissions &&
        permissions.rolePermissions[permission as keyof RolePermissions]) ||
      (permission in permissions.teamRulePermissions &&
        permissions.teamRulePermissions[
          permission as keyof TeamRulePermissions
        ])
    );
  };

  return { hasPermission, permissions };
}
