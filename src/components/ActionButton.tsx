import { Button, ButtonProps } from '@/components/ui/button';
import { useActionPermissions } from '@/hooks/useActionPermissions';
import { RolePermissions, TeamRulePermissions } from '@/types/permissions';

interface ActionButtonProps extends ButtonProps {
  permission: keyof RolePermissions | keyof TeamRulePermissions;
}

export function ActionButton({
  permission,
  children,
  ...props
}: ActionButtonProps) {
  const { hasPermission } = useActionPermissions();

  if (!hasPermission(permission)) {
    return null;
  }

  return <Button {...props}>{children}</Button>;
}
