import { AppSidebar } from '@/components/AppSidebar';
import { AppTopBar } from '@/components/AppTopBar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SidebarProvider } from '@/components/ui/sidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import {
  acceptInvite,
  fetchUserPendingInvites,
  rejectInvite,
} from '@/services/inviteService';
import { TeamRule } from '@/types/invite';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Loader2, X } from 'lucide-react';
import React from 'react';

const getTeamRuleName = (ruleId: number): string => {
  switch (ruleId) {
    case TeamRule.Viewer:
      return 'Viewer';
    case TeamRule.Editor:
      return 'Editor';
    case TeamRule.Leader:
      return 'Leader';
    default:
      return 'Unknown';
  }
};

interface UserInvitesProps {
  isEmbedded?: boolean;
}

const UserInvites: React.FC<UserInvitesProps> = ({ isEmbedded = false }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id || 0;

  // Query to fetch user pending invites
  const { data: invites = [], isLoading } = useQuery({
    queryKey: ['userInvites', userId],
    queryFn: () => fetchUserPendingInvites(userId),
    enabled: !!userId,
    meta: {
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to load your invites',
          variant: 'destructive',
        });
      },
    },
  });

  // Mutation to accept invite
  const acceptMutation = useMutation({
    mutationFn: (id: number) => acceptInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInvites'] });
      toast({
        title: 'Success',
        description: 'Invite accepted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to accept invite',
        variant: 'destructive',
      });
    },
  });

  // Mutation to reject invite
  const rejectMutation = useMutation({
    mutationFn: (id: number) => rejectInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInvites'] });
      toast({
        title: 'Success',
        description: 'Invite rejected successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to reject invite',
        variant: 'destructive',
      });
    },
  });

  const handleAccept = (id: number) => {
    acceptMutation.mutate(id);
  };

  const handleReject = (id: number) => {
    rejectMutation.mutate(id);
  };

  const isActionLoading = acceptMutation.isPending || rejectMutation.isPending;

  const content = (
    <>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : invites.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Você não tem convites pendentes.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Permissão</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.map((invite) => (
              <TableRow key={invite.id}>
                <TableCell>{invite.teamName}</TableCell>
                <TableCell>{getTeamRuleName(invite.teamRule)}</TableCell>
                <TableCell>
                  {new Date(invite.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAccept(invite.id)}
                      disabled={isActionLoading}
                      className="bg-green-50 hover:bg-green-100"
                    >
                      {acceptMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                      <span className="ml-1">Aceitar</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(invite.id)}
                      disabled={isActionLoading}
                      className="bg-red-50 hover:bg-red-100"
                    >
                      {rejectMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span className="ml-1">Rejeitar</span>
                    </Button>
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

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppTopBar />
          <main className="flex-1 p-6">
            <Card>
              <CardHeader>
                <CardTitle>Meus Convites</CardTitle>
                <CardDescription>
                  Visualize e gerencie seus convites pendentes.
                </CardDescription>
              </CardHeader>
              <CardContent>{content}</CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserInvites;
