import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SidebarProvider } from '@/components/ui/sidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { fetchTeamById, fetchTeamMembers } from '@/services/teamService';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const TeamMembers = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const teamId = id ? parseInt(id) : 0;

  // Query to fetch team details
  const { data: team, isLoading: isLoadingTeam } = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => fetchTeamById(teamId),
    enabled: !!teamId,
  });

  // Query to fetch team members
  const { data: members = [], isLoading: isLoadingMembers } = useQuery({
    queryKey: ['team-members', teamId],
    queryFn: () => fetchTeamMembers(teamId),
    enabled: !!teamId,
    meta: {
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to load team members',
          variant: 'destructive',
        });
      },
    },
  });

  const isLoading = isLoadingTeam || isLoadingMembers;

  const handleManageInvites = () => {
    navigate(`/teams/${teamId}/invites`);
  };

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
            onClick={() => navigate('/admin')}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar Para Times
          </Button>

          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Membros - {team?.name}</CardTitle>
              <CardDescription>
                Visualizar e gerenciar os membros do time.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex gap-2 items-center"
                onClick={handleManageInvites}
              >
                <Mail className="h-4 w-4" />
                Convites
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Não encontrado membros no time.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Permissão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.$id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.roleName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default TeamMembers;
