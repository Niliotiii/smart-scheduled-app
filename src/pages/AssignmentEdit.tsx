
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchAssignmentById, updateAssignment } from "@/services/assignmentService";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const AssignmentEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedTeam } = useAuth();
  const navigate = useNavigate();
  const teamId = selectedTeam?.id;
  const assignmentId = id ? parseInt(id) : undefined;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { isLoading, error } = useQuery({
    queryKey: ["assignment", teamId, assignmentId],
    queryFn: () => teamId && assignmentId 
      ? fetchAssignmentById(teamId, assignmentId) 
      : Promise.reject("Invalid assignment ID or team ID"),
    enabled: !!teamId && !!assignmentId,
    meta: {
      onSuccess: (data) => {
        form.reset({
          title: data.title,
          description: data.description,
        });
      },
    },
  });

  const updateAssignmentMutation = useMutation({
    mutationFn: (values: FormValues) => {
      if (!teamId || !assignmentId) {
        throw new Error("No team or assignment selected");
      }
      return updateAssignment(teamId, assignmentId, values);
    },
    onSuccess: () => {
      toast.success("Assignment updated successfully");
      navigate(`/assignments/${assignmentId}`);
    },
    onError: (error: Error) => {
      toast.error(`Error updating assignment: ${error.message}`);
    },
  });

  const onSubmit = (values: FormValues) => {
    updateAssignmentMutation.mutate(values);
  };

  if (!teamId) {
    return <div className="p-8">No team selected. Please select a team first.</div>;
  }

  if (isLoading) return <div className="p-8">Loading assignment data...</div>;
  if (error) return <div className="p-8">Error loading assignment: {(error as Error).message}</div>;

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/assignments/${assignmentId}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Assignment</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Update Assignment</CardTitle>
            <CardDescription>Update the details of your assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Assignment title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the assignment in detail" 
                          className="min-h-[150px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(`/assignments/${assignmentId}`)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={updateAssignmentMutation.isPending}
                  >
                    {updateAssignmentMutation.isPending ? "Updating..." : "Update Assignment"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssignmentEdit;
