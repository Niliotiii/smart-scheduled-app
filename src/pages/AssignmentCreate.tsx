
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createAssignment } from "@/services/assignmentService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AssignmentCreateRequest } from "@/types/assignment";

const AssignmentCreate = () => {
  const navigate = useNavigate();
  const { selectedTeam } = useAuth();
  const teamId = selectedTeam?.id || 0;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Mutation to create a new assignment
  const createAssignmentMutation = useMutation({
    mutationFn: (data: AssignmentCreateRequest) => createAssignment(teamId, data),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Assignment created successfully",
      });
      navigate(`/assignments/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create assignment: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure title is not empty as it's required
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }
    
    const assignmentData: AssignmentCreateRequest = {
      title: title,
      description: description
    };
    
    createAssignmentMutation.mutate(assignmentData);
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/assignments")} 
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Assignments
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Create New Assignment</CardTitle>
            <CardDescription>
              Add a new assignment to your team
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter assignment title"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter assignment description"
                  rows={5}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/assignments")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createAssignmentMutation.isPending}
              >
                {createAssignmentMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Assignment
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default AssignmentCreate;
