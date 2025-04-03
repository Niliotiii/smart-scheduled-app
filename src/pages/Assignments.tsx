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
import { ClipboardList, Eye, Pencil, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Assignments = () => {
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

  if (isLoading) {
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
                <Button onClick={() => navigate('/assignments/create')}>
                  <Plus className="mr-2 h-4 w-4" /> Criar Função
                </Button>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
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
                    Gerencie as Funções do Seu Time
                  </p>
                </div>
                <Button onClick={() => navigate('/assignments/create')}>
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
          <main className="flex-1 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Funções</h1>
                <p className="text-muted-foreground">
                  Gerencie as Funções do Seu Time
                </p>
              </div>
              <Button onClick={() => navigate('/assignments/create')}>
                <Plus className="mr-2 h-4 w-4" /> Criar Função
              </Button>
            </div>

            {assignments && assignments.length > 0 ? (
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
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              navigate(`/assignments/${assignment.id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              navigate(`/assignments/${assignment.id}/edit`)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
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
                    <Button
                      onClick={() => navigate('/assignments/create')}
                      className="mt-4"
                    >
                      Criar Função
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Assignments;
