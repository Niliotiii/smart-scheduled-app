import { useAuth } from '@/contexts/AuthContext';
import { useRenderPermissions } from '@/hooks/useRenderPermissions';
import { RolePermissions, TeamRulePermissions } from '@/types/permissions';
import { ReactNode } from 'react';

interface PermissionGuardProps {
  children: ReactNode;
  permission: string;
  fallback?: ReactNode;
}

export function PermissionGuard({
  children,
  permission,
  fallback = null,
}: PermissionGuardProps) {
  const { selectedTeam } = useAuth();
  const {
    data: permissions,
    isLoading,
    isError,
  } = useRenderPermissions(selectedTeam);

  if (isLoading) {
    return <div>Loading permissions...</div>;
  }

  if (isError || !permissions) {
    console.error('Permission check failed');
    return fallback;
  }

  console.log('Checking permission:', permission, permissions); // Debug log

  const hasPermission =
    (permission in permissions.rolePermissions &&
      permissions.rolePermissions[permission as keyof RolePermissions]) ||
    (permission in permissions.teamRulePermissions &&
      permissions.teamRulePermissions[permission as keyof TeamRulePermissions]);

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}
