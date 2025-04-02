
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createTeam } from "@/services/teamService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TeamFormData = {
  name: string;
  description: string;
};

const CreateTeam = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TeamFormData>({ name: "", description: "" });

  // Mutation to create a new team
  const createTeamMutation = useMutation({
    mutationFn: (team: Omit<TeamFormData, "id">) => createTeam(team),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Team created successfully",
      });
      navigate("/teams");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create team: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    createTeamMutation.mutate(formData);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/teams")} 
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Teams
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Create New Team</CardTitle>
              <CardDescription>
                Add a new team to your organization
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateTeam}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Team Name</label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter team name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter team description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/teams")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createTeamMutation.isPending}
                >
                  {createTeamMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Team
                </Button>
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CreateTeam;
