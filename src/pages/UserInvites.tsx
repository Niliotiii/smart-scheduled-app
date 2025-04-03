
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserPendingInvites, acceptInvite, rejectInvite } from "@/services/inviteService";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2, Check, X } from "lucide-react";
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

interface UserInvitesProps {
  isEmbedded?: boolean;
}

const UserInvites: React.FC<UserInvitesProps> = ({ isEmbedded = false }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id || 0;
  
  // Query to fetch user pending invites
  const { data: invites = [], isLoading } = useQuery({
    queryKey: ["userInvites", userId],
    queryFn: () => fetchUserPendingInvites(userId),
    enabled: !!userId,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to load your invites",
          variant: "destructive",
        });
      }
    }
  });

  // Mutation to accept invite
  const acceptMutation = useMutation({
    mutationFn: (id: number) => acceptInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInvites"] });
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
      queryClient.invalidateQueries({ queryKey: ["userInvites"] });
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
          You have no pending invites.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.map((invite) => (
              <TableRow key={invite.id}>
                <TableCell>{invite.teamName}</TableCell>
                <TableCell>{getTeamRuleName(invite.teamRule)}</TableCell>
                <TableCell>{new Date(invite.createdAt).toLocaleString()}</TableCell>
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
                      <span className="ml-1">Accept</span>
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
                      <span className="ml-1">Reject</span>
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
      <div className="flex min-h-screen w-full flex-col">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <main className="flex-1 p-6">
            <Card>
              <CardHeader>
                <CardTitle>My Invites</CardTitle>
                <CardDescription>
                  View and manage your team invitations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {content}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserInvites;
