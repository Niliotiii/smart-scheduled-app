
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTeamById, addTeamMember } from "@/services/teamService";
import { fetchUsers } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, UserPlus } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types/user";

const TeamMemberAdd = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const teamId = id ? parseInt(id) : 0;
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("Viewer");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Query to fetch team details
  const { data: team, isLoading: isLoadingTeam } = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => fetchTeamById(teamId),
    enabled: !!teamId,
  });

  // Query to fetch all users
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const handleAddMember = async () => {
    if (!selectedUserId) {
      toast({
        title: "Error",
        description: "Please select a user",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await addTeamMember(teamId, parseInt(selectedUserId), selectedRole);
      
      toast({
        title: "Success",
        description: "Member added to team successfully",
      });
      
      navigate(`/teams/${teamId}/members`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add member to team",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isLoadingTeam || isLoadingUsers;

  if (isLoading) {
    return (
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 p-6 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/teams/${teamId}/members`)} 
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Team Members
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Add Team Member</CardTitle>
              <CardDescription>
                Add a new member to {team?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select User</label>
                  <Select
                    value={selectedUserId}
                    onValueChange={setSelectedUserId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((user: User) => (
                        <SelectItem 
                          key={user.id} 
                          value={user.id.toString() || `user-${user.email}`}
                        >
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select
                    value={selectedRole}
                    onValueChange={setSelectedRole}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                      <SelectItem value="Member">Member</SelectItem>
                      <SelectItem value="Leader">Leader</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleAddMember} 
                    disabled={isSubmitting || !selectedUserId}
                    className="flex gap-2 items-center"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                    Add to Team
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default TeamMemberAdd;
