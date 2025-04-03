import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { fetchTeamById, updateTeam } from '@/services/teamService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type TeamFormData = {
  name: string;
  description: string;
};

const EditTeam = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const teamId = id ? parseInt(id) : 0;
  const [formData, setFormData] = useState<TeamFormData>({
    name: '',
    description: '',
  });

  const { data: team, isLoading } = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => fetchTeamById(teamId),
    enabled: !!teamId,
  });

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        description: team.description,
      });
    }
  }, [team]);

  const updateTeamMutation = useMutation({
    mutationFn: (data: TeamFormData) => updateTeam(teamId, data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Team updated successfully',
      });
      navigate('/teams');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update team: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        variant: 'destructive',
      });
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeamMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 p-6 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/teams')}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar Para Times
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Editar Time</CardTitle>
              <CardDescription>
                Atualize as informações do time conforme necessário.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateTeam}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nome
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter team name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Descrição
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter team description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/teams')}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateTeamMutation.isPending}>
                  {updateTeamMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Atualizar Time
                </Button>
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EditTeam;
