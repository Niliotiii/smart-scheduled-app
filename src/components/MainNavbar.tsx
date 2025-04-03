
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { User, Bell, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const MainNavbar = () => {
  const { user, selectedTeam, userTeamRule } = useAuth();
  const navigate = useNavigate();

  const getRuleName = (rule: number | undefined) => {
    if (!rule && rule !== 0) return "Unknown";
    
    switch (rule) {
      case 0: return "Viewer";
      case 1: return "Member";
      case 2: return "Leader";
      case 3: return "Admin";
      default: return "Unknown";
    }
  };

  return (
    <div className="w-full border-b border-border bg-card/50 py-1">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-4">
          {selectedTeam && (
            <div className="font-medium">
              {selectedTeam.name}
              <span className="ml-2 text-sm text-muted-foreground">
                ({getRuleName(userTeamRule)})
              </span>
            </div>
          )}
        </div>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-8">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user?.name ?? "User"}
                </span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => navigate("/user-invites")}
                    >
                      <Mail className="mr-2 h-4 w-4" /> My Invites
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => navigate("/profile")}
                    >
                      <User className="mr-2 h-4 w-4" /> My Profile
                    </Button>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default MainNavbar;
