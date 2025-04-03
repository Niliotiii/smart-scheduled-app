
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { fetchSchedules, deleteSchedule } from "@/services/scheduleService";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
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

const Schedules = () => {
  const navigate = useNavigate();
  const { selectedTeam } = useAuth();
  const teamId = selectedTeam?.id || 0;
  
  const { data: schedules, isLoading, refetch } = useQuery({
    queryKey: ["schedules", teamId],
    queryFn: () => fetchSchedules(teamId),
    enabled: !!teamId,
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: (id: number) => deleteSchedule(teamId, id),
    onSuccess: () => {
      toast.success("Schedule deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete schedule: ${error instanceof Error ? error.message : "Unknown error"}`);
    },
  });

  const handleDelete = (id: number) => {
    deleteScheduleMutation.mutate(id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!teamId) {
    return (
      <div className="p-8">No team selected. Please select a team first.</div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Schedules</h1>
          <Button 
            onClick={() => navigate("/schedules/create")} 
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" /> 
            Create Schedule
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : !schedules || schedules.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium">No schedules found</h3>
            <p className="text-gray-500 mt-2">Create a new schedule to get started.</p>
            <Button 
              onClick={() => navigate("/schedules/create")} 
              className="mt-4"
            >
              Create Schedule
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-md shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">{schedule.title}</TableCell>
                    <TableCell>{schedule.description}</TableCell>
                    <TableCell>{formatDate(schedule.startDate)}</TableCell>
                    <TableCell>{formatDate(schedule.endDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/schedules/${schedule.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/schedules/${schedule.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
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
                                This action cannot be undone. This will permanently delete this
                                schedule and all related assignments.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(schedule.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Schedules;
