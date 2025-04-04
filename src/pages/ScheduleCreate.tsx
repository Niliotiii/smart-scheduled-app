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
import { createSchedule } from '@/services/scheduleService';
import { ScheduleCreateRequest } from '@/types/schedule';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ScheduleCreate = () => {
  const navigate = useNavigate();
  const { selectedTeam } = useAuth();
  const teamId = selectedTeam?.id || 0;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const createScheduleMutation = useMutation({
    mutationFn: (data: ScheduleCreateRequest) => createSchedule(teamId, data),
    onSuccess: () => {
      toast.success('Schedule created successfully');
      navigate('/schedules');
    },
    onError: (error) => {
      toast.error(
        `Failed to create schedule: ${
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

    const scheduleData: ScheduleCreateRequest = {
      title,
      description,
      startDate,
      endDate,
    };

    createScheduleMutation.mutate(scheduleData);
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
          onClick={() => navigate('/schedules')}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar Para Escalas
        </Button>

        <CardHeader>
          <CardTitle>Criar Escala</CardTitle>
          <CardDescription>
            Adicione uma nova escala ao seu time
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
              onClick={() => navigate('/schedules')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createScheduleMutation.isPending}>
              {createScheduleMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Criar Escala
            </Button>
          </CardFooter>
        </form>
      </main>
    </div>
  );
};

export default ScheduleCreate;
