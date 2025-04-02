
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchInvites, fetchPendingInvites, acceptInvite, rejectInvite, deleteInvite } from "@/services/inviteService";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2, Check, X, Trash2 } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { TeamRule } from "@/types/invite";

const getTeamRuleName = (ruleId: number): string => {
  switch (ruleId) {
    case TeamRule.Viewer:
      return "Viewer";
    case TeamRule.Member:
      return "Member";
    case TeamRule.Leader:
      return "Leader";
    case TeamRule.Admin:
      return "Admin";
    default:
      return "Unknown";
  }
};

const Invites = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");

  // Query to fetch all invites
  const { data: allInvites = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ["invites"],
    queryFn: fetchInvites,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to load invites",
          variant: "destructive",
        });
      }
    }
  });

  // Query to fetch pending invites
  const { data: pendingInvites = [], isLoading: isLoadingPending } = useQuery({
    queryKey: ["pendingInvites"],
    queryFn: fetchPendingInvites,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to load pending invites",
          variant: "destructive",
        });
      }
    }
  });

  // Mutation to accept invite
  const acceptMutation = useMutation({
    mutationFn: (id: number) => acceptInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      queryClient.invalidateQueries({ queryKey: ["pendingInvites"] });
      toast({
        title: "Success",
        description: "Invite accepted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to accept invite",
        variant: "destructive",
      });
    },
  });

  // Mutation to reject invite
  const rejectMutation = useMutation({
    mutationFn: (id: number) => rejectInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      queryClient.invalidateQueries({ queryKey: ["pendingInvites"] });
      toast({
        title: "Success",
        description: "Invite rejected successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject invite",
        variant: "destructive",
      });
    },
  });

  // Mutation to delete invite
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      queryClient.invalidateQueries({ queryKey: ["pendingInvites"] });
      toast({
        title: "Success",
        description: "Invite deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete invite",
        variant: "destructive",
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

  const isLoading = isLoadingAll || isLoadingPending || 
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
              <CardTitle>Invites</CardTitle>
              <CardDescription>
                Manage team invitations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All Invites</TabsTrigger>
                  <TabsTrigger value="pending">Pending Invites</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="w-full">
                  {isLoadingAll ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : allInvites.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No invites found.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Team</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created At</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allInvites.map((invite) => (
                          <TableRow key={invite.id}>
                            <TableCell>{invite.teamName}</TableCell>
                            <TableCell>{invite.userName}</TableCell>
                            <TableCell>{getTeamRuleName(invite.teamRule)}</TableCell>
                            <TableCell>{invite.status}</TableCell>
                            <TableCell>{new Date(invite.createdAt).toLocaleString()}</TableCell>
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
                      No pending invites found.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Team</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Created At</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingInvites.map((invite) => (
                          <TableRow key={invite.id}>
                            <TableCell>{invite.teamName}</TableCell>
                            <TableCell>{invite.userName}</TableCell>
                            <TableCell>{getTeamRuleName(invite.teamRule)}</TableCell>
                            <TableCell>{new Date(invite.createdAt).toLocaleString()}</TableCell>
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
