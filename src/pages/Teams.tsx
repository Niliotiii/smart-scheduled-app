
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchTeams } from "@/services/teamService";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Users, UserRoundPlus } from "lucide-react";
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

interface TeamsProps {
  isEmbedded?: boolean;
}

const Teams: React.FC<TeamsProps> = ({ isEmbedded = false }) => {
  const navigate = useNavigate();
  const { userTeamRule } = useAuth();
  const isAdmin = userTeamRule === 3; // 3 = Admin role
  
  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to load teams",
          variant: "destructive",
        });
      }
    }
  });

  const handleCreate = () => {
    navigate("/teams/create");
  };

  const handleEdit = (id: number) => {
    navigate(`/teams/${id}/edit`);
  };

  const handleViewMembers = (id: number) => {
    navigate(`/teams/${id}/members`);
  };

  const content = (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Teams List</h2>
        {isAdmin && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Team
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No teams found.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell>{team.description}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewMembers(team.id)}
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Members
                    </Button>
                    {isAdmin && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(team.id)}
                      >
                        Edit
                      </Button>
                    )}
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
                <CardTitle>Teams</CardTitle>
                <CardDescription>
                  Manage your teams
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

export default Teams;
