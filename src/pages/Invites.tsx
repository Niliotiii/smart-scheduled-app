import { AppSidebar } from '@/components/AppSidebar';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import {
  acceptInvite,
  deleteInvite,
  fetchInvites,
  fetchPendingInvites,
  rejectInvite,
} from '@/services/inviteService';
import { TeamRule } from '@/types/invite';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Loader2, Trash2, X } from 'lucide-react';
import { useState } from 'react';

const getTeamRuleName = (ruleId: number): string => {
  switch (ruleId) {
    case TeamRule.Viewer:
      return 'Viewer';
    case TeamRule.Member:
      return 'Member';
    case TeamRule.Leader:
      return 'Leader';
    default:
      return 'Unknown';
  }
};

const Invites = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');

  const { data: allInvites = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ['invites'],
    queryFn: fetchInvites,
    meta: {
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to load invites',
          variant: 'destructive',
        });
      },
    },
  });

  const { data: pendingInvites = [], isLoading: isLoadingPending } = useQuery({
    queryKey: ['pendingInvites'],
    queryFn: fetchPendingInvites,
    meta: {
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to load pending invites',
          variant: 'destructive',
        });
      },
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (id: number) => acceptInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] });
      queryClient.invalidateQueries({ queryKey: ['pendingInvites'] });
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

  const rejectMutation = useMutation({
    mutationFn: (id: number) => rejectInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] });
      queryClient.invalidateQueries({ queryKey: ['pendingInvites'] });
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

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] });
      queryClient.invalidateQueries({ queryKey: ['pendingInvites'] });
      toast({
        title: 'Success',
        description: 'Invite deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete invite',
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

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const isLoading =
    isLoadingAll ||
    isLoadingPending ||
    acceptMutation.isPending ||
    rejectMutation.isPending ||
    deleteMutation.isPending;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Convites</CardTitle>
              <CardDescription>Gerencie os convites do Time</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-6">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="pending">Pendentes</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="w-full">
                  {isLoadingAll ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : allInvites.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Não encontrado convites.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Usuário</TableHead>
                          <TableHead>Permissão</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allInvites.map((invite) => (
                          <TableRow key={invite.id}>
                            <TableCell>{invite.teamName}</TableCell>
                            <TableCell>{invite.userName}</TableCell>
                            <TableCell>
                              {getTeamRuleName(invite.teamRule)}
                            </TableCell>
                            <TableCell>{invite.status}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(invite.id)}
                                  disabled={isLoading}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>

                <TabsContent value="pending" className="w-full">
                  {isLoadingPending ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : pendingInvites.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Não encontrado convites pendentes.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Usuário</TableHead>
                          <TableHead>Permissão</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingInvites.map((invite) => (
                          <TableRow key={invite.id}>
                            <TableCell>{invite.teamName}</TableCell>
                            <TableCell>{invite.userName}</TableCell>
                            <TableCell>
                              {getTeamRuleName(invite.teamRule)}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAccept(invite.id)}
                                  disabled={isLoading}
                                  className="bg-green-50 hover:bg-green-100"
                                >
                                  <Check className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleReject(invite.id)}
                                  disabled={isLoading}
                                  className="bg-red-50 hover:bg-red-100"
                                >
                                  <X className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Invites;
