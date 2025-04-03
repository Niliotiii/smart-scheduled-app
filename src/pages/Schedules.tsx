import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import SchedulesList from "@/components/SchedulesList";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Schedules = () => {
  const { selectedTeam } = useAuth();
  const navigate = useNavigate();

  if (!selectedTeam) {
    return <div>Please select a team.</div>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full flex-col">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <main className="flex-1 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Schedules</h1>
                <p className="text-muted-foreground">
                  Manage your team schedules
                </p>
              </div>
              <Button onClick={() => navigate("/schedules/create")}>
                Create Schedule
              </Button>
            </div>
            
            <SchedulesList />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Schedules;
