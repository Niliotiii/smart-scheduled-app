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
import { toast } from '@/hooks/use-toast';
import {
  fetchAssignmentById,
  updateAssignment,
} from '@/services/assignmentService';
import { AssignmentUpdateRequest } from '@/types/assignment';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AssignmentEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const assignmentId = id ? parseInt(id) : 0;
  const { selectedTeam } = useAuth();
  const teamId = selectedTeam?.id || 0;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const { data: assignment, isLoading } = useQuery({
    queryKey: ['assignment', teamId, assignmentId],
    queryFn: () => fetchAssignmentById(teamId, assignmentId),
    enabled: !!teamId && !!assignmentId,
  });

  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title || '');
      setDescription(assignment.description || '');
    }
  }, [assignment]);

  const updateAssignmentMutation = useMutation({
    mutationFn: (data: AssignmentUpdateRequest) =>
      updateAssignment(teamId, assignmentId, data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Assignment updated successfully',
      });
      navigate(`/assignments/${assignmentId}`);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update assignment: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    const assignmentData: AssignmentUpdateRequest = {
      title: title,
      description: description,
    };

    updateAssignmentMutation.mutate(assignmentData);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/assignments`)}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar Para Funções
        </Button>

        <CardHeader>
          <CardTitle>Editar Função</CardTitle>
          <CardDescription>
            Atualize as informações da função conforme necessário.
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
                placeholder="Enter assignment title"
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
                placeholder="Enter assignment description"
                rows={5}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/assignments/${assignmentId}`)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={updateAssignmentMutation.isPending}>
              {updateAssignmentMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Atualizar Função
            </Button>
          </CardFooter>
        </form>
      </main>
    </div>
  );
};

export default AssignmentEdit;
