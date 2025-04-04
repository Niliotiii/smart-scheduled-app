import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { fetchScheduleById, updateSchedule } from '@/services/scheduleService';
import { ScheduleUpdateRequest } from '@/types/schedule';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const ScheduleEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const scheduleId = id ? parseInt(id) : 0;
  const { selectedTeam } = useAuth();
  const teamId = selectedTeam?.id || 0;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: schedule, isLoading } = useQuery({
    queryKey: ['schedule', teamId, scheduleId],
    queryFn: () => fetchScheduleById(teamId, scheduleId),
    enabled: !!teamId && !!scheduleId,
  });

  useEffect(() => {
    if (schedule) {
      setTitle(schedule.title || '');
      setDescription(schedule.description || '');

      const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
      };

      setStartDate(formatDateForInput(schedule.startDate));
      setEndDate(formatDateForInput(schedule.endDate));
    }
  }, [schedule]);

  const updateScheduleMutation = useMutation({
    mutationFn: (data: ScheduleUpdateRequest) =>
      updateSchedule(teamId, scheduleId, data),
    onSuccess: () => {
      toast.success('Schedule updated successfully');
      navigate(`/schedules/${scheduleId}`);
    },
    onError: (error) => {
      toast.error(
        `Failed to update schedule: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!startDate) {
      toast.error('Start date is required');
      return;
    }

    if (!endDate) {
      toast.error('End date is required');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    const scheduleData: ScheduleUpdateRequest = {
      title,
      description,
      startDate,
      endDate,
    };

    updateScheduleMutation.mutate(scheduleData);
  };

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
          onClick={() => navigate(`/schedules`)}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar Para Escalas
        </Button>

        <CardHeader>
          <CardTitle>Editar Escala</CardTitle>
          <CardDescription>
            Atualize as informações da escala conforme necessário
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Título
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter schedule title"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descrição
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter schedule description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium">
                  Data Inicial
                </label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium">
                  Data Final
                </label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/schedules/${scheduleId}`)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateScheduleMutation.isPending || isLoading}
            >
              {(updateScheduleMutation.isPending || isLoading) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Atualizar Escala
            </Button>
          </CardFooter>
        </form>
      </main>
    </div>
  );
};

export default ScheduleEdit;
