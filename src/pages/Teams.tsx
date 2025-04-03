import { ActionButton } from '@/components/ActionButton';
import { AppSidebar } from '@/components/AppSidebar';
import { AppTopBar } from '@/components/AppTopBar';
import {
  Card,
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
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { fetchTeams } from '@/services/teamService';
import { useQuery } from '@tanstack/react-query';
import { Edit, Loader2, Plus, Trash, Users } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TeamsProps {
  isEmbedded?: boolean;
}

const Teams: React.FC<TeamsProps> = ({ isEmbedded = false }) => {
  const navigate = useNavigate();

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
    meta: {
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to load teams',
          variant: 'destructive',
        });
      },
    },
  });

  const handleCreate = () => {
    navigate('/teams/create');
  };

  const handleEdit = (id: number) => {
    navigate(`/teams/${id}/edit`);
  };

  const handleViewMembers = (id: number) => {
    navigate(`/teams/${id}/members`);
  };

  const handleDelete = (id: number) => {
    // Add delete logic here
  };

  const content = (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Times</h2>
        <ActionButton
          permission="CreateTeams"
          tooltip="Criar Time"
          onClick={handleCreate}
        >
          <Plus className="h-4 w-4" />
        </ActionButton>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhum time encontrado.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell>{team.description}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <ActionButton
                      permission="ViewTeam"
                      variant="outline"
                      tooltip="Ver Membros"
                      onClick={() => handleViewMembers(team.id)}
                    >
                      <Users className="h-4 w-4" />
                    </ActionButton>

                    <ActionButton
                      permission="EditTeams"
                      variant="outline"
                      tooltip="Editar Time"
                      onClick={() => handleEdit(team.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </ActionButton>

                    <ActionButton
                      permission="DeleteTeams"
                      variant="destructive"
                      tooltip="Excluir Time"
                      onClick={() => handleDelete(team.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </ActionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppTopBar />
          <main className="flex-1 p-6">
            <Card>
              <CardHeader>
                <CardTitle>Times</CardTitle>
                <CardDescription>Gerencie Seus Times</CardDescription>
              </CardHeader>
              <CardContent>{content}</CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Teams;
