
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { createAssignment } from "@/services/assignmentService";
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

const AssignmentCreate = () => {
  const { selectedTeam } = useAuth();
  const navigate = useNavigate();
  const teamId = selectedTeam?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const createAssignmentMutation = useMutation({
    mutationFn: (values: FormValues) => {
      if (!teamId) {
        throw new Error("No team selected");
      }
      return createAssignment(teamId, values);
    },
    onSuccess: () => {
      toast.success("Assignment created successfully");
      navigate("/assignments");
    },
    onError: (error: Error) => {
      toast.error(`Error creating assignment: ${error.message}`);
    },
  });

  const onSubmit = (values: FormValues) => {
    createAssignmentMutation.mutate(values);
  };

  if (!teamId) {
    return <div className="p-8">No team selected. Please select a team first.</div>;
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate("/assignments")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Create Assignment</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>New Assignment</CardTitle>
            <CardDescription>Create a new assignment for your team</CardDescription>
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
                    onClick={() => navigate("/assignments")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createAssignmentMutation.isPending}
                  >
                    {createAssignmentMutation.isPending ? "Creating..." : "Create Assignment"}
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

export default AssignmentCreate;
