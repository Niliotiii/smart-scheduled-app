import { ActionButton } from '@/components/ActionButton';
import { AppSidebar } from '@/components/AppSidebar';
import { AppTopBar } from '@/components/AppTopBar';
import { Button } from '@/components/ui/button';
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
import { useAuth } from '@/contexts/AuthContext';
import { fetchAssignments } from '@/services/assignmentService';
import { useQuery } from '@tanstack/react-query';
import { ClipboardList, Pencil, Plus, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Assignment {
  id: string | number;
  title: string;
  description: string;
}

const Assignments = ({ isEmbedded = false }) => {
  const { selectedTeam } = useAuth();
  const navigate = useNavigate();

  const {
    data: assignments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['assignments', selectedTeam?.id],
    queryFn: () => fetchAssignments(selectedTeam!.id),
    enabled: !!selectedTeam,
  });

  if (!selectedTeam) {
    return <div>Porfavor Selecione Um Time.</div>;
  }

  const handleCreate = () => {
    navigate('/assignments/create');
  };

  const handleEdit = (id: string | number) => {
    navigate(`/assignments/${id}/edit`);
  };

  const handleDelete = (id: string | number) => {
    // Add delete logic here
  };

  const content = (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Funções</h2>
        <ActionButton permission="CreateAssignments" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Função
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
      ) : assignments.length === 0 ? (
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">
                Função não encontrada
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Não há funções disponíveis para o seu time
              </p>
              <Button onClick={handleCreate} className="mt-4">
                Criar Função
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell className="font-medium">
                  {assignment.title}
                </TableCell>
                <TableCell>{assignment.description}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <ActionButton
                      permission="EditAssignments"
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(assignment.id)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </ActionButton>
                    <ActionButton
                      permission="DeleteAssignments"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(assignment.id)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Excluir
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
                    Gerencie as Funções do Seu Time
                  </p>
                </div>
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" /> Criar Função
                </Button>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center text-red-500">
                    <p>Erro ao Carregar Funções</p>
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

export default Assignments;
