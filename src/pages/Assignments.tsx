
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAssignments, deleteAssignment } from "@/services/assignmentService";
import { AppSidebar } from "@/components/AppSidebar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, Edit, Plus, Eye } from "lucide-react";
import { toast } from "sonner";

const Assignments = () => {
  const { selectedTeam } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const teamId = selectedTeam?.id;

  const { data: assignments, isLoading, error } = useQuery({
    queryKey: ["assignments", teamId],
    queryFn: () => (teamId ? fetchAssignments(teamId) : Promise.resolve([])),
    enabled: !!teamId,
  });

  const deleteAssignmentMutation = useMutation({
    mutationFn: ({ teamId, assignmentId }: { teamId: number; assignmentId: number }) => 
      deleteAssignment(teamId, assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", teamId] });
      toast.success("Assignment deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Error deleting assignment: ${error.message}`);
    },
  });

  const handleDelete = (assignmentId: number) => {
    if (!teamId) return;
    
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      deleteAssignmentMutation.mutate({ teamId, assignmentId });
    }
  };

  if (isLoading) return <div className="p-8">Loading assignments...</div>;
  if (error) return <div className="p-8">Error loading assignments: {(error as Error).message}</div>;

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Assignments</h1>
          <Button onClick={() => navigate("/assignments/create")}>
            <Plus className="mr-2 h-4 w-4" /> Create Assignment
          </Button>
        </div>
        
        {assignments && assignments.length === 0 ? (
          <div className="text-center p-8 border rounded-lg">
            <p className="text-muted-foreground">No assignments found. Create your first assignment!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments?.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription>Created on {new Date(assignment.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3">{assignment.description}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/assignments/${assignment.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/assignments/${assignment.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(assignment.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;
