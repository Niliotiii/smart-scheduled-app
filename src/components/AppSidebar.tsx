import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useRenderPermissions } from '@/hooks/useRenderPermissions';
import {
  Briefcase,
  Calendar,
  CalendarClock,
  ClipboardList,
  LogOut,
  Settings,
  Users,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export function AppSidebar() {
  const { selectedTeam, logout, clearTeamSelection, user} = useAuth();
  const { data: permissions } = useRenderPermissions(selectedTeam);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChangeTeam = () => {
    console.log(user);
    clearTeamSelection();
    navigate('/team-selection');
  };

  const handleSettingsAdmin = () => {
    navigate('/admin');
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const menuItems = [
    {
      label: 'Dashboard',
      icon: Briefcase,
      path: '/',
      isActive: location.pathname === '/',
      show: true,
    },
    {
      label: 'Funções',
      icon: ClipboardList,
      path: '/assignments',
      isActive: isActive('/assignments'),
      show: permissions?.teamRulePermissions.ViewAssignments,
    },
    {
      label: 'Escalas',
      icon: Calendar,
      path: '/schedules',
      isActive: isActive('/schedules'),
      show: permissions?.teamRulePermissions.ViewSchedules,
    },
    {
      label: 'Times',
      icon: Users,
      path: `/teams`,
      isActive: isActive('/teams'),
      show:
        permissions?.rolePermissions.ViewTeams ||
        permissions?.rolePermissions.ViewOwnTeams,
    },
  ];

  return (
    <Sidebar>
      <SidebarRail />
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-blue-500" />
            <h1 className="text-xl font-bold">SmartSchedule</h1>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems
                .filter((item) => item.show)
                .map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      isActive={item.isActive}
                      tooltip={item.label}
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-4">
        <div className="space-y-2">
          {permissions.rolePermissions.ManageSystem && (
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleSettingsAdmin}
            >
              <Settings className="h-4 w-4" />
              Administrador
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleChangeTeam}
          >
            <Users className="h-4 w-4" />
            Trocar Time
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
