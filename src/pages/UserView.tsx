import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUserById, fetchUserTeams, fetchUserPermissions } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Edit, Users } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UserView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = id ? parseInt(id) : 0;

  // Query to fetch user details
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to load user details",
          variant: "destructive",
        });
      }
    }
  });

  // Query to fetch user teams
  const { data: teamsResponse, isLoading: isLoadingTeams } = useQuery({
    queryKey: ['user-teams', userId],
    queryFn: () => fetchUserTeams(userId),
    enabled: !!userId,
  });

  // Query to fetch user permissions
  const { data: permissionsResponse, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['user-permissions', userId],
    queryFn: () => fetchUserPermissions(userId),
    enabled: !!userId,
  });

  const teams = teamsResponse?.data.$values || [];
  const permissions = permissionsResponse?.data.$values || [];
  const isLoading = isLoadingUser || isLoadingTeams || isLoadingPermissions;

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
            onClick={() => navigate("/admin")} 
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar Para Usuários
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Detalhes do Usuário</CardTitle>
                  <CardDescription>
                    Visualize e edite as informações do usuário
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/users/${userId}/edit`)}
                  className="flex gap-2 items-center"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nome</p>
                      <p>{user?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nome de Usuário</p>
                      <p>{user?.username}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p>{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">CPF</p>
                      <p>{user?.cpf || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Telefone</p>
                      <p>{user?.cellphone || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <p className="text-sm font-medium text-gray-500 mb-2">Endereço</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Rua</p>
                        <p>{user?.street || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Cidade</p>
                        <p>{user?.city || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Estado</p>
                        <p>{user?.state || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">CEP</p>
                        <p>{user?.postalCode || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">País</p>
                        <p>{user?.country || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Times</CardTitle>
                <CardDescription>
                  Visualize os times dos quais o usuário é membro.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {teams.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    O usuário não é membro de nenhum time.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Permissão</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teams.map((team, index) => (
                        <TableRow key={index}>
                          <TableCell>{team.name}</TableCell>
                          <TableCell>{team.teamRule}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default UserView;
