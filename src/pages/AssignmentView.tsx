import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAssignmentById } from '@/services/assignmentService';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const AssignmentView = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedTeam } = useAuth();
  const navigate = useNavigate();
  const teamId = selectedTeam?.id;
  const assignmentId = id ? parseInt(id) : undefined;

  const {
    data: assignment,
    isLoading: isLoadingAssignment,
    error: assignmentError,
  } = useQuery({
    queryKey: ['assignment', teamId, assignmentId],
    queryFn: () =>
      teamId && assignmentId
        ? fetchAssignmentById(teamId, assignmentId)
        : Promise.reject('Invalid assignment ID or team ID'),
    enabled: !!teamId && !!assignmentId,
  });

  const isLoading = isLoadingAssignment;
  const error = assignmentError;

  if (isLoading) return <div className="p-8">Carregando Funções...</div>;
  if (error)
    return (
      <div className="p-8">
        Erro ao Carregar Funções: {(error as Error).message}
      </div>
    );
  if (!assignment) return <div className="p-8">Função Não Encontrada</div>;

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/assignments')}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar Para Funções
        </Button>

        <Card>
          <div className="flex-1 p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Detalhes da Função</h1>
              </div>
              <Button
                onClick={() => navigate(`/assignments/${assignmentId}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" /> Editar Função
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">
                    {assignment.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AssignmentView;
