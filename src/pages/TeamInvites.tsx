import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SidebarProvider } from '@/components/ui/sidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import {
  createInvite,
  deleteInvite,
  fetchTeamInvites,
} from '@/services/inviteService';
import { fetchTeamById } from '@/services/teamService';
import { fetchUsers } from '@/services/userService';
import { TeamRule } from '@/types/invite';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface CreateInvitePayload {
  teamId: number;
  userEmail: string;
  teamRule: number;
}

const TeamInvites = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const teamId = id ? parseInt(id) : 0;
  const queryClient = useQueryClient();

  const [selectedUserEmail, setSelectedUserEmail] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>(
    TeamRule.Viewer.toString()
  );
  const [activeTab, setActiveTab] = useState('invites');

  // Add this helper function at the top of the component
  const getTeamRuleLabel = (rule: number): string => {
    const teamRuleLabels: Record<number, string> = {
      [TeamRule.Viewer]: 'Viewer',
      [TeamRule.Editor]: 'Editor',
      [TeamRule.Leader]: 'Leader',
    };
    return teamRuleLabels[rule] || 'Unknown';
  };

  // Query to fetch team details
  const { data: team, isLoading: isLoadingTeam } = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => fetchTeamById(teamId),
    enabled: !!teamId,
  });

  // Query to fetch team invites
  const { data: invites = [], isLoading: isLoadingInvites } = useQuery({
    queryKey: ['teamInvites', teamId],
    queryFn: () => fetchTeamInvites(teamId),
    enabled: !!teamId,
    meta: {
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to load team invites',
          variant: 'destructive',
        });
      },
    },
  });

  // Query to fetch all users
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // Mutation to create invite
  const createMutation = useMutation({
    mutationFn: () =>
      createInvite({
        teamId,
        userEmail: selectedUserEmail,
        teamRule: parseInt(selectedRole),
      } as CreateInvitePayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamInvites'] });
      setSelectedUserEmail('');
      toast({
        title: 'Success',
        description: 'Invite sent successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send invite',
        variant: 'destructive',
      });
    },
  });

  // Mutation to delete invite
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamInvites'] });
      toast({
        title: 'Success',
        description: 'Invite deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete invite',
        variant: 'destructive',
      });
    },
  });

  const handleCreateInvite = () => {
    if (!selectedUserEmail) {
      toast({
        title: 'Error',
        description: 'Please enter a user email',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedUserEmail.includes('@')) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    createMutation.mutate();
  };

  const handleDeleteInvite = (id: number) => {
    deleteMutation.mutate(id);
  };

  const isLoading = isLoadingTeam || isLoadingInvites || isLoadingUsers;
  const isSubmitting = createMutation.isPending || deleteMutation.isPending;

  if (isLoading) {
    return (
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 p-6 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/teams/${teamId}/members`)}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar Para Membros
          </Button>

          <CardHeader>
            <CardTitle>Convites do Time - {team?.name}</CardTitle>
            <CardDescription>Gerencie os convites do time</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-6">
                <TabsTrigger value="invites">Convites Atuais</TabsTrigger>
                <TabsTrigger value="send">Enviar Convite</TabsTrigger>
              </TabsList>

              <TabsContent value="invites" className="w-full">
                {invites.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum convite no time.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Permissão</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invites.map((invite) => (
                        <TableRow key={invite.id}>
                          <TableCell>{invite.userName}</TableCell>
                          <TableCell>
                            {getTeamRuleLabel(invite.teamRule)}
                          </TableCell>
                          <TableCell>{invite.status}</TableCell>
                          <TableCell>
                            {new Date(invite.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteInvite(invite.id)}
                              disabled={isSubmitting}
                            >
                              {deleteMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 text-red-500" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              <TabsContent value="send" className="w-full">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Email do usuário
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border rounded-md"
                      value={selectedUserEmail}
                      onChange={(e) => setSelectedUserEmail(e.target.value)}
                      placeholder="Digite o email do usuário"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Permissão</label>
                    <Select
                      value={selectedRole}
                      onValueChange={setSelectedRole}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TeamRule.Viewer.toString()}>
                          Viewer
                        </SelectItem>
                        <SelectItem value={TeamRule.Editor.toString()}>
                          Editor
                        </SelectItem>
                        <SelectItem value={TeamRule.Leader.toString()}>
                          Leader
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleCreateInvite}
                      disabled={isSubmitting || !selectedUserEmail}
                      className="flex gap-2 items-center"
                    >
                      {createMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="h-4 w-4" />
                      )}
                      Enviar Convite
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default TeamInvites;
