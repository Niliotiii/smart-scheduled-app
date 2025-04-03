
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { fetchScheduleById, deleteSchedule } from "@/services/scheduleService";
import { fetchAssignedByScheduleId, deleteAssigned } from "@/services/assignedService";
import { fetchAssignmentById } from "@/services/assignmentService";
import { fetchTeamMembers } from "@/services/teamService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Edit, Trash2, Calendar, Loader2, UserRound, ClipboardList } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Assignment } from "@/types/assignment";

const ScheduleView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const scheduleId = id ? parseInt(id) : 0;
  const { selectedTeam } = useAuth();
  const teamId = selectedTeam?.id || 0;
  
  // Track assignments and members data
  const [assignmentsData, setAssignmentsData] = useState<{[key: number]: Assignment}>({});
  const [membersData, setMembersData] = useState<{[key: number]: any}>({});

  // Fetch the schedule
  const { data: schedule, isLoading: isLoadingSchedule } = useQuery({
    queryKey: ['schedule', teamId, scheduleId],
    queryFn: () => fetchScheduleById(teamId, scheduleId),
    enabled: !!teamId && !!scheduleId,
  });

  // Fetch team members
  const { data: members } = useQuery({
    queryKey: ['teamMembers', teamId],
    queryFn: () => fetchTeamMembers(teamId),
    enabled: !!teamId,
  });

  // Update membersData when members are loaded
  useEffect(() => {
    if (members) {
      const membersMap = {};
      members.forEach(member => {
        membersMap[member.id] = member;
      });
      setMembersData(membersMap);
    }
  }, [members]);

  // Fetch assignments for this schedule
  const { 
    data: assignedTasks, 
    isLoading: isLoadingAssigned,
    refetch: refetchAssigned 
  } = useQuery({
    queryKey: ['assignedTasks', scheduleId],
    queryFn: () => fetchAssignedByScheduleId(scheduleId),
    enabled: !!scheduleId,
  });

  // Fetch assignment details when assigned tasks are loaded
  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      if (!assignedTasks || !teamId) return;
      
      const assignments = {};
      for (const task of assignedTasks) {
        try {
          const assignment = await fetchAssignmentById(teamId, task.assignmentId);
          assignments[task.assignmentId] = assignment;
        } catch (error) {
          console.error("Error fetching assignment:", error);
        }
      }
      
      setAssignmentsData(assignments);
    };

    fetchAssignmentDetails();
  }, [assignedTasks, teamId]);

  // Delete schedule mutation
  const deleteScheduleMutation = useMutation({
    mutationFn: () => deleteSchedule(teamId, scheduleId),
    onSuccess: () => {
      toast.success("Schedule deleted successfully");
      navigate("/schedules");
    },
    onError: (error) => {
      toast.error(`Failed to delete schedule: ${error instanceof Error ? error.message : "Unknown error"}`);
    },
  });

  // Delete assigned task mutation
  const deleteAssignedMutation = useMutation({
    mutationFn: (assignedId: number) => deleteAssigned(assignedId),
    onSuccess: () => {
      toast.success("Assignment removed from schedule");
      refetchAssigned();
    },
    onError: (error) => {
      toast.error(`Failed to remove assignment: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  });

  const handleDeleteSchedule = () => {
    deleteScheduleMutation.mutate();
  };

  const handleRemoveAssignment = (assignedId: number) => {
    deleteAssignedMutation.mutate(assignedId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isLoading = isLoadingSchedule || isLoadingAssigned;

  if (!teamId) {
    return <div className="p-8">No team selected. Please select a team first.</div>;
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/schedules")} 
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Schedules
        </Button>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : !schedule ? (
          <div className="text-center py-12">
            <p>Schedule not found</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold">{schedule.title}</h1>
                <p className="text-gray-500 mt-1">{schedule.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/schedules/${scheduleId}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this
                        schedule and all assigned tasks.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteSchedule}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Schedule Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Start Date</p>
                    <p className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      {formatDate(schedule.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">End Date</p>
                    <p className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      {formatDate(schedule.endDate)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assigned Tasks</CardTitle>
                <CardDescription>
                  Tasks assigned to team members for this schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAssigned ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
                ) : !assignedTasks || assignedTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <ClipboardList className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium">No assigned tasks</h3>
                    <p className="text-gray-500 mt-2">
                      Go to the Assign page to assign tasks to members for this schedule.
                    </p>
                    <Button 
                      onClick={() => navigate("/assign")} 
                      className="mt-4"
                    >
                      Assign Tasks
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assignment</TableHead>
                        <TableHead>Team Member</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignedTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            {assignmentsData[task.assignmentId]?.title || (
                              <span className="text-gray-400">Loading...</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <UserRound className="h-4 w-4 mr-2 text-blue-500" />
                              {membersData[task.memberId]?.name || "Unknown Member"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will remove this assignment from the schedule.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleRemoveAssignment(task.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate("/assign")} 
                  className="ml-auto"
                >
                  Assign More Tasks
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default ScheduleView;
