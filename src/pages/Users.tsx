import { ActionButton } from '@/components/ActionButton';
import { AppSidebar } from '@/components/AppSidebar';
import { AppTopBar } from '@/components/AppTopBar';
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
import { fetchUsers } from '@/services/userService';
import { useQuery } from '@tanstack/react-query';
import { Edit, Eye, Plus, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Users = ({ isEmbedded = false }) => {
  const { selectedTeam } = useAuth();
  const navigate = useNavigate();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users', selectedTeam?.id],
    queryFn: () => fetchUsers(),
    enabled: !!selectedTeam?.id,
  });

  if (!selectedTeam) {
    return <div>Selecione Um Time.</div>;
  }

  const handleCreate = () => {
    navigate('/users/create');
  };

  const handleView = (id: string | number) => {
    navigate(`/users/${id}`);
  };

  const handleEdit = (id: string | number) => {
    navigate(`/users/${id}/edit`);
  };

  const handleDelete = (id: string | number) => {
    // Add delete logic here
  };

  const content = (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Usuários</h2>
        <ActionButton
          permission="CreateUsers"
          tooltip="Criar Usuário"
          onClick={handleCreate}
        >
          <Plus className="h-4 w-4" />
        </ActionButton>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="mt-2 text-lg font-medium">
                Nenhum usuário encontrado
              </h3>
              <p className="text-sm text-muted-foreground">
                Você pode criar um novo usuário clicando no botão acima
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <ActionButton
                      permission="ViewUsers"
                      variant="outline"
                      tooltip="Ver Usuário"
                      onClick={() => handleView(user.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </ActionButton>

                    <ActionButton
                      permission="EditUsers"
                      variant="outline"
                      tooltip="Editar Usuário"
                      onClick={() => handleEdit(user.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </ActionButton>

                    <ActionButton
                      permission="DeleteUsers"
                      variant="destructive"
                      tooltip="Remover Usuário"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </ActionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );

  if (isEmbedded) {
    return content;
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
                  <h1 className="text-2xl font-bold">Usuários</h1>
                  <p className="text-muted-foreground">
                    Gerencie os Usuários do Sistema
                  </p>
                </div>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center text-red-500">
                    <p>Erro ao Carregar Usuários</p>
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
          <main className="flex-1 p-6">{content}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Users;
