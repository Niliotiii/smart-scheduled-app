import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider } from '@/components/ui/sidebar';
import { toast } from '@/hooks/use-toast';
import { fetchTeamById } from '@/services/teamService';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function TeamView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const teamId = id ? parseInt(id) : 0;

  const { data: team, isLoading } = useQuery({
    queryKey: ['team', id],
    queryFn: async () => {
      try {
        return await fetchTeamById(teamId);
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Falha ao carregar informações do time',
          variant: 'destructive',
        });
        throw error;
      }
    },
    enabled: !!id,
  });

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

        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Detalhes do Time</h1>
            </div>
          </div>

          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle>{team.name}</CardTitle>
            </div>
            {/* <p className="text-sm text-muted-foreground">
              Time: {team.}
            </p> */}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Descrição</h3>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {team.description}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div>
                <span>Criado em: </span>
                <time dateTime={team.createdAt}>
                  {new Date(team.createdAt).toLocaleDateString()}
                </time>
              </div>
              {team.updatedAt && (
                <div>
                  <span>Atualizado em: </span>
                  <time dateTime={team.updatedAt}>
                    {new Date(team.updatedAt).toLocaleDateString()}
                  </time>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </main>
    </div>
  );
}
