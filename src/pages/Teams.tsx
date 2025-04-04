import { ActionButton } from '@/components/ActionButton';
import { AppSidebar } from '@/components/AppSidebar';
import { AppTopBar } from '@/components/AppTopBar';
import { Card, CardContent } from '@/components/ui/card';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { fetchTeams } from '@/services/teamService';
import { useQuery } from '@tanstack/react-query';
import { ClipboardList, Edit, Plus, Trash, Users } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TeamsProps {
  isEmbedded?: boolean;
}

const Teams: React.FC<TeamsProps> = ({ isEmbedded = false }) => {
  const navigate = useNavigate();

  const {
    data: teams,
    isLoading,
    error,
  } = useQuery({
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

  const handleView = (id: number) => {
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
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : teams.length === 0 ? (
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">
                Nenhum time encontrado
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Não há times para serem mostrados para você
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell>{team.description}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <ActionButton
                      permission="ViewTeam"
                      variant="outline"
                      tooltip="Ver Membros"
                      onClick={() => handleView(team.id)}
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

  if (error) {
    return (
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <AppTopBar />
            <main className="flex-1 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Funções</h1>
                  <p className="text-muted-foreground">
                    Gerencie os Seus Times
                  </p>
                </div>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center text-red-500">
                    <p>Erro ao Carregar Times</p>
                  </div>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppTopBar />
          <main className="flex-1 p-6">{content}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Teams;
