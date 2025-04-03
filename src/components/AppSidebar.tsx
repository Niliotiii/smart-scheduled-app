
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
} from "@/components/ui/sidebar";
import {
  Users,
  UserPlus,
  Briefcase,
  Calendar,
  LogOut,
  CalendarClock,
  ClipboardList,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { selectedTeam, logout, clearTeamSelection, userTeamRule } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = userTeamRule === 3; // 3 = Admin

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChangeTeam = () => {
    clearTeamSelection();
    navigate("/team-selection");
  };

  const handleSettingsAdmin = () => {
    navigate("/admin");
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: Briefcase,
      path: "/",
      isActive: location.pathname === "/",
    },
    {
      label: "Assignments",
      icon: ClipboardList,
      path: "/assignments",
      isActive: isActive("/assignments"),
    },
    {
      label: "Schedule",
      icon: Calendar,
      path: "/schedules",
      isActive: isActive("/schedules"),
    },
    {
      label: "Admin",
      icon: Settings,
      path: "/admin",
      isActive: isActive("/admin"),
      show: isAdmin,
    }
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
          <SidebarGroupLabel>{selectedTeam?.name || "Dashboard"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems
                .filter(item => item.show !== false)
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
          {isAdmin && (
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => navigate('/admin')}
            >
              <Settings className="h-4 w-4" />
              Admin Panel
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleSettingsAdmin}
          >
            <Users className="h-4 w-4" />
            Settings Admin
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleChangeTeam}
          >
            <Users className="h-4 w-4" />
            Change Team
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
