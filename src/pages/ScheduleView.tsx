import { AppSidebar } from '@/components/AppSidebar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import {
  deleteAssigned,
  fetchAssignedByScheduleId,
} from '@/services/assignedService';
import { fetchAssignmentById } from '@/services/assignmentService';
import { deleteSchedule, fetchScheduleById } from '@/services/scheduleService';
import { fetchTeamMembers } from '@/services/teamService';
import { Assignment } from '@/types/assignment';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Calendar,
  ClipboardList,
  Edit,
  Loader2,
  Trash2,
  UserRound,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const ScheduleView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const scheduleId = id ? parseInt(id) : 0;
  const { selectedTeam } = useAuth();
  const teamId = selectedTeam?.id || 0;


  const { data: schedule, isLoading: isLoadingSchedule } = useQuery({
    queryKey: ['schedule', teamId, scheduleId],
    queryFn: () => fetchScheduleById(teamId, scheduleId),
    enabled: !!teamId && !!scheduleId,
  });

  const {
    data: assignedTasks,
    isLoading: isLoadingAssigned,
    refetch: refetchAssigned,
  } = useQuery({
    queryKey: ['assignedTasks', scheduleId],
    queryFn: () => fetchAssignedByScheduleId(teamId, scheduleId),
    enabled: !!scheduleId,
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: () => deleteSchedule(teamId, scheduleId),
    onSuccess: () => {
      toast.success('Schedule deleted successfully');
      navigate('/schedules');
    },
    onError: (error) => {
      toast.error(
        `Failed to delete schedule: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    },
  });

  const deleteAssignedMutation = useMutation({
    mutationFn: (assignedId: number) => deleteAssigned(teamId, assignedId),
    onSuccess: () => {
      toast.success('Assignment removed from schedule');
      refetchAssigned();
    },
    onError: (error) => {
      toast.error(
        `Failed to remove assignment: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    },
  });

  const handleDeleteSchedule = () => {
    deleteScheduleMutation.mutate();
  };

  const handleRemoveAssignment = (assignedId: number) => {
    deleteAssignedMutation.mutate(assignedId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isLoading = isLoadingSchedule || isLoadingAssigned;

  if (!teamId) {
    return (
      <div className="p-8">
        Nenhum time selecionado. Porfavor selecione um time.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/schedules')}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar Para Escalas
        </Button>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : !schedule ? (
          <div className="text-center py-12">
            <p>Nenhuma Escala Encontrada.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold">{schedule.title}</h1>
                <p className="text-gray-500 mt-1">{schedule.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/schedules/${scheduleId}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Escala
                </Button>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Detalhes da Escala</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Data Inicial
                    </p>
                    <p className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      {formatDate(schedule.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Data Final
                    </p>
                    <p className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      {formatDate(schedule.endDate)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funções</CardTitle>
                <CardDescription>
                  Funções adicionadas a esta escala. Você pode adicionar ou remover
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAssigned ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
                ) : !assignedTasks || assignedTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <ClipboardList className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium">Nenhuma Função Adicionada</h3>
                    <p className="text-gray-500 mt-2">
                      Adicione funções a esta escala para começar.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Função</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignedTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            {task?.title || (
                              <span className="text-gray-400">Loading...</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <UserRound className="h-4 w-4 mr-2 text-blue-500" />
                              {task?.user.name ||
                                'Unknown Member'}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Tem certeza?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Isso removera a função da escala.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleRemoveAssignment(task.id)
                                    }
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default ScheduleView;
