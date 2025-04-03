import { useAuth } from '@/contexts/AuthContext';
import { RolePermissions, TeamRulePermissions } from '@/types/permissions';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRenderPermissions } from './useRenderPermissions';

type PermissionType = keyof RolePermissions | keyof TeamRulePermissions;

export function usePermissionGuard(requiredPermission: PermissionType) {
  const { selectedTeam } = useAuth();
  const { data: permissions } = useRenderPermissions(selectedTeam);
  const navigate = useNavigate();

  useEffect(() => {
    if (!permissions) return;

    const hasPermission =
      (requiredPermission in permissions.rolePermissions &&
        permissions.rolePermissions[
          requiredPermission as keyof RolePermissions
        ]) ||
      (requiredPermission in permissions.teamRulePermissions &&
        permissions.teamRulePermissions[
          requiredPermission as keyof TeamRulePermissions
        ]);

    if (!hasPermission) {
      navigate('/unauthorized');
    }
  }, [permissions, requiredPermission, navigate]);

  return !!permissions;
}
