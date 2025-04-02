
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { fetchTeamMembers } from "@/services/teamService";
import { fetchAssignments } from "@/services/assignmentService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
import { Label } from "@/components/ui/label";

const Assign = () => {
  const { selectedTeam } = useAuth();
  const teamId = selectedTeam?.id;
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedAssignment, setSelectedAssignment] = useState<string>("");

  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["teamMembers", teamId],
    queryFn: () => (teamId ? fetchTeamMembers(teamId) : Promise.resolve([])),
    enabled: !!teamId,
  });

  const { data: assignments, isLoading: isLoadingAssignments } = useQuery({
    queryKey: ["assignments", teamId],
    queryFn: () => (teamId ? fetchAssignments(teamId) : Promise.resolve([])),
    enabled: !!teamId,
  });

  const handleAssign = () => {
    if (!selectedUser || !selectedAssignment) {
      toast.error("Please select both a user and an assignment");
      return;
    }

    // Normally we would call an API endpoint to assign the user to the assignment
    // For now, we'll just show a success toast
    toast.success(`User assigned to assignment successfully!`);
    setSelectedUser("");
    setSelectedAssignment("");
  };

  const isLoading = isLoadingMembers || isLoadingAssignments;

  if (!teamId) {
    return <div className="p-8">No team selected. Please select a team first.</div>;
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Assign Members to Tasks</h1>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Assignment</CardTitle>
            <CardDescription>Assign team members to specific tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="user">Select User</Label>
                <Select
                  value={selectedUser}
                  onValueChange={setSelectedUser}
                  disabled={isLoading}
                >
                  <SelectTrigger id="user">
                    <SelectValue placeholder="Select a team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members?.map((member: any) => (
                      <SelectItem key={member.email} value={member.email}>
                        {member.name} ({member.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignment">Select Assignment</Label>
                <Select
                  value={selectedAssignment}
                  onValueChange={setSelectedAssignment}
                  disabled={isLoading}
                >
                  <SelectTrigger id="assignment">
                    <SelectValue placeholder="Select an assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignments?.map((assignment) => (
                      <SelectItem key={assignment.id} value={assignment.id.toString()}>
                        {assignment.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full" 
                onClick={handleAssign}
                disabled={!selectedUser || !selectedAssignment}
              >
                Assign Member to Task
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Assign;
