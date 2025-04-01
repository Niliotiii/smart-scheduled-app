
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTeams } from "@/services/teamService";
import { Team } from "@/types/team";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Users, User } from "lucide-react";

const TeamSelection = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getTeams = async () => {
      try {
        setLoading(true);
        const teamsData = await fetchTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
        toast({
          title: "Error",
          description: "Failed to load teams. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getTeams();
  }, []);

  const handleTeamSelection = (team: Team) => {
    // Here we can store the selected team in localStorage or context
    localStorage.setItem("selectedTeam", JSON.stringify(team));
    toast({
      title: "Team Selected",
      description: `You've selected ${team.name}`,
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">Team Selection</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-5 w-5" />
            <span>{user?.username || "User"}</span>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select a Team</CardTitle>
            <CardDescription>
              Choose which team you want to work with
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : teams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team) => (
                  <Card 
                    key={team.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleTeamSelection(team)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{team.description}</p>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between items-center">
                      <div className="flex items-center text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="text-sm">Team</span>
                      </div>
                      <Button size="sm" variant="outline">Select</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No teams available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TeamSelection;
