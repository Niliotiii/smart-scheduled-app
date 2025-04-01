
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { 
  fetchTeams, 
  createTeam, 
  updateTeam, 
  deleteTeam,
  fetchTeamMembers
} from "@/services/teamService";
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Users, 
  X,
  Loader2 
} from "lucide-react";
import { Team } from "@/types/team";
import { Textarea } from "@/components/ui/textarea";

type TeamFormData = {
  name: string;
  description: string;
};

type TeamMember = {
  id: number;
  userId: number;
  username: string;
  role: string;
};

const Teams = () => {
  const { selectedTeam } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewMembersDialogOpen, setIsViewMembersDialogOpen] = useState(false);
  const [selectedTeamForAction, setSelectedTeamForAction] = useState<Team | null>(null);
  const [formData, setFormData] = useState<TeamFormData>({ name: "", description: "" });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Query to fetch teams
  const { data: teams = [], isLoading: isLoadingTeams, error: teamsError } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  });

  // Mutation to create a new team
  const createTeamMutation = useMutation({
    mutationFn: (team: Omit<Team, "id">) => createTeam(team),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: "Success",
        description: "Team created successfully",
      });
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create team: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  // Mutation to update an existing team
  const updateTeamMutation = useMutation({
    mutationFn: ({ id, team }: { id: number; team: Partial<Team> }) => updateTeam(id, team),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: "Success",
        description: "Team updated successfully",
      });
      setIsEditDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update team: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  // Mutation to delete a team
  const deleteTeamMutation = useMutation({
    mutationFn: (id: number) => deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: "Success",
        description: "Team deleted successfully",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete team: ${error instanceof Error ? error.message : 'Unknown error'}`,
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

  const handleUpdateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTeamForAction) {
      updateTeamMutation.mutate({
        id: selectedTeamForAction.id,
        team: formData,
      });
    }
  };

  const handleDeleteTeam = () => {
    if (selectedTeamForAction) {
      deleteTeamMutation.mutate(selectedTeamForAction.id);
    }
  };

  const openEditDialog = (team: Team) => {
    setSelectedTeamForAction(team);
    setFormData({
      name: team.name,
      description: team.description,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (team: Team) => {
    setSelectedTeamForAction(team);
    setIsDeleteDialogOpen(true);
  };

  const openViewMembersDialog = async (team: Team) => {
    setSelectedTeamForAction(team);
    try {
      const members = await fetchTeamMembers(team.id);
      setTeamMembers(members);
      setIsViewMembersDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setSelectedTeamForAction(null);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Teams Management</CardTitle>
                <CardDescription>
                  Manage your organization's teams
                </CardDescription>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex gap-2 items-center" onClick={() => resetForm()}>
                    <PlusCircle className="h-4 w-4" />
                    Create Team
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Team</DialogTitle>
                    <DialogDescription>
                      Add a new team to your organization
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateTeam}>
                    <div className="grid gap-4 py-4">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="name">Team Name</label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter team name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="description">Description</label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Enter team description"
                          value={formData.description}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createTeamMutation.isPending}>
                        {createTeamMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Create Team
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoadingTeams ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : teamsError ? (
                <div className="text-center py-8 text-red-500">
                  Error loading teams. Please try again.
                </div>
              ) : teams.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No teams found. Create your first team to get started.
                </div>
              ) : (
                <Table>
                  <TableCaption>List of all teams</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell>{team.id}</TableCell>
                        <TableCell className="font-medium">{team.name}</TableCell>
                        <TableCell>{team.description}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openViewMembersDialog(team)}
                              title="View Members"
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openEditDialog(team)}
                              title="Edit Team"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => openDeleteDialog(team)}
                              title="Delete Team"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Edit Team Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Team</DialogTitle>
                <DialogDescription>
                  Make changes to the team details
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateTeam}>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-name">Team Name</label>
                    <Input
                      id="edit-name"
                      name="name"
                      placeholder="Enter team name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-description">Description</label>
                    <Textarea
                      id="edit-description"
                      name="description"
                      placeholder="Enter team description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateTeamMutation.isPending}>
                    {updateTeamMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Team Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Team</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this team? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteTeam}
                  disabled={deleteTeamMutation.isPending}
                >
                  {deleteTeamMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete Team
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* View Team Members Dialog */}
          <Dialog open={isViewMembersDialogOpen} onOpenChange={setIsViewMembersDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  <span>Team Members - {selectedTeamForAction?.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setIsViewMembersDialogOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DialogTitle>
                <DialogDescription>
                  View all members of this team
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[400px] overflow-y-auto">
                {teamMembers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No members found in this team.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>{member.username}</TableCell>
                          <TableCell>{member.role}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Teams;
