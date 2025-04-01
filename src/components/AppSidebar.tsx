
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
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Users,
  UserPlus,
  Briefcase,
  Calendar,
  LogOut,
  User,
  CalendarClock,
  UserRoundPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { selectedTeam, logout, clearTeamSelection } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChangeTeam = () => {
    clearTeamSelection();
    navigate("/team-selection");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      label: "Team",
      icon: Users,
      path: "/teams",
      isActive: isActive("/teams"),
    },
    {
      label: "Users",
      icon: User,
      path: "/users",
      isActive: isActive("/users"),
    },
    {
      label: "Invite",
      icon: UserPlus,
      path: "/invites",
      isActive: isActive("/invites"),
    },
    {
      label: "Assignments",
      icon: Briefcase,
      path: "/assignments",
      isActive: isActive("/assignments"),
    },
    {
      label: "Assign",
      icon: UserRoundPlus,
      path: "/assign",
      isActive: isActive("/assign"),
    },
    {
      label: "Schedule",
      icon: Calendar,
      path: "/schedules",
      isActive: isActive("/schedules"),
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
          <SidebarGroupLabel>{selectedTeam?.name || "Dashboard"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
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
