import { ActionButton } from '@/components/ActionButton';
import { Card, CardContent } from '@/components/ui/card';
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
import { fetchSchedules } from '@/services/scheduleService';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar, Edit, Eye, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SchedulesList = () => {
  const { selectedTeam } = useAuth();
  const navigate = useNavigate();

  const {
    data: schedules,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['schedules', selectedTeam?.id],
    queryFn: () => fetchSchedules(selectedTeam!.id),
    enabled: !!selectedTeam,
  });

  const handleView = (id: string | number) => {
    navigate(`/schedules/${id}`);
  };

  const handleEdit = (id: string | number) => {
    navigate(`/schedules/${id}/edit`);
  };

  const handleDelete = (id: string | number) => {
    // Add delete logic here
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-red-500">
            <p>Error loading schedules</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!schedules || schedules.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">
              Nenhuma escala encontrada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Você ainda não tem escalas criadas. Crie uma nova escala para
              começar.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Data Inicial</TableHead>
          <TableHead>Data Final</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedules.map((schedule) => (
          <TableRow key={schedule.id}>
            <TableCell className="font-medium">{schedule.title}</TableCell>
            <TableCell>{schedule.description}</TableCell>
            <TableCell>{format(new Date(schedule.startDate), 'PPP')}</TableCell>
            <TableCell>{format(new Date(schedule.endDate), 'PPP')}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <ActionButton
                  permission="ViewSchedules"
                  variant="ghost"
                  tooltip="Visualizar"
                  onClick={() => handleView(schedule.id)}
                >
                  <Eye className="h-4 w-4" />
                </ActionButton>

                <ActionButton
                  permission="EditSchedules"
                  variant="outline"
                  tooltip="Editar"
                  onClick={() => handleEdit(schedule.id)}
                >
                  <Edit className="h-4 w-4" />
                </ActionButton>

                <ActionButton
                  permission="DeleteSchedules"
                  variant="destructive"
                  tooltip="Excluir"
                  onClick={() => handleDelete(schedule.id)}
                >
                  <Trash className="h-4 w-4" />
                </ActionButton>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SchedulesList;
