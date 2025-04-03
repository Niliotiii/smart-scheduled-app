import { ActionButton } from '@/components/ActionButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Edit, Plus, Trash, UserPlus } from 'lucide-react';

export default function Users() {
  const { selectedTeam } = useAuth();
  const { data: users, isLoading } = useQuery({
    queryKey: ['users', selectedTeam?.id],
    queryFn: () => fetchUsers(),
    enabled: !!selectedTeam?.id,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Usuários</CardTitle>
        <div className="space-x-2">
          <ActionButton permission="CreateUsers">
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </ActionButton>
          <ActionButton permission="ManageInvites">
            <UserPlus className="h-4 w-4 mr-2" />
            Convidar
          </ActionButton>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <ActionButton
                      permission="EditUsers"
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </ActionButton>
                    <ActionButton
                      permission="DeleteUsers"
                      variant="destructive"
                      size="sm"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Remover
                    </ActionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
