
import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { fetchTeamMembers } from "@/services/teamService";
import { fetchAssignments } from "@/services/assignmentService";
import { fetchSchedules } from "@/services/scheduleService";
import { createAssigned } from "@/services/assignedService";
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
import { Loader2 } from "lucide-react";

const Assign = () => {
  const { selectedTeam } = useAuth();
  const teamId = selectedTeam?.id;
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedAssignment, setSelectedAssignment] = useState<string>("");
  const [selectedSchedule, setSelectedSchedule] = useState<string>("");

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

  const { data: schedules, isLoading: isLoadingSchedules } = useQuery({
    queryKey: ["schedules", teamId],
    queryFn: () => (teamId ? fetchSchedules(teamId) : Promise.resolve([])),
    enabled: !!teamId,
  });

  const assignMutation = useMutation({
    mutationFn: createAssigned,
    onSuccess: () => {
      toast.success("Task assigned successfully!");
      setSelectedUser("");
      setSelectedAssignment("");
      setSelectedSchedule("");
    },
    onError: (error) => {
      toast.error(`Failed to assign task: ${error instanceof Error ? error.message : "Unknown error"}`);
    },
  });

  const handleAssign = () => {
    if (!selectedUser || !selectedAssignment || !selectedSchedule) {
      toast.error("Please select a user, assignment, and schedule");
      return;
    }

    assignMutation.mutate({
      memberId: parseInt(selectedUser),
      assignmentId: parseInt(selectedAssignment),
      scheduledId: parseInt(selectedSchedule),
    });
  };

  const isLoading = isLoadingMembers || isLoadingAssignments || isLoadingSchedules || assignMutation.isPending;

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
            <CardDescription>Assign team members to specific tasks and schedules</CardDescription>
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
                      <SelectItem key={member.id || member.email} value={member.id?.toString() || ""}>
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

              <div className="space-y-2">
                <Label htmlFor="schedule">Select Schedule</Label>
                <Select
                  value={selectedSchedule}
                  onValueChange={setSelectedSchedule}
                  disabled={isLoading}
                >
                  <SelectTrigger id="schedule">
                    <SelectValue placeholder="Select a schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    {schedules?.map((schedule) => (
                      <SelectItem key={schedule.id} value={schedule.id.toString()}>
                        {schedule.title} ({new Date(schedule.startDate).toLocaleDateString()} - {new Date(schedule.endDate).toLocaleDateString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full" 
                onClick={handleAssign}
                disabled={!selectedUser || !selectedAssignment || !selectedSchedule || isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
