import { Button, ButtonProps } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useActionPermissions } from '@/hooks/useActionPermissions';
import { RolePermissions, TeamRulePermissions } from '@/types/permissions';

interface ActionButtonProps extends ButtonProps {
  permission: keyof RolePermissions | keyof TeamRulePermissions;
  tooltip?: string;
}

export function ActionButton({
  permission,
  children,
  tooltip,
  ...props
}: ActionButtonProps) {
  const { hasPermission } = useActionPermissions();

  if (!hasPermission(permission)) {
    return null;
  }

  const button = (
    <Button size="icon" {...props}>
      {children}
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}
