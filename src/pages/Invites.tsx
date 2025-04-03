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
import { fetchInvites } from '@/services/inviteService';
import { useQuery } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';

export default function Invites() {
  const { selectedTeam } = useAuth();
  const { data: invites, isLoading } = useQuery({
    queryKey: ['invites', selectedTeam?.id],
    queryFn: () => fetchInvites(selectedTeam?.id!),
    enabled: !!selectedTeam?.id,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Convites Pendentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites?.map((invite) => (
              <TableRow key={invite.id}>
                <TableCell>{invite.email}</TableCell>
                <TableCell>{invite.status}</TableCell>
                <TableCell>
                  {new Date(invite.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <ActionButton
                      permission="ManageInvites"
                      variant="outline"
                      size="sm"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Aprovar
                    </ActionButton>
                    <ActionButton
                      permission="ManageInvites"
                      variant="destructive"
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Rejeitar
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
