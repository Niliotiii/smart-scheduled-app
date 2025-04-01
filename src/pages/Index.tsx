
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, selectedTeam, logout, clearTeamSelection } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChangeTeam = () => {
    clearTeamSelection();
    navigate("/team-selection");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-5 w-5" />
              <span>{user?.username || "User"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-5 w-5" />
              <span>{selectedTeam?.name || "No team selected"}</span>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-blue-300 text-blue-500 hover:bg-blue-50"
              onClick={handleChangeTeam}
            >
              Change Team
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-red-300 text-red-500 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Welcome to {selectedTeam?.name}</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              You are authenticated and can access all features for this team.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <p className="text-gray-600">
              Team Description: {selectedTeam?.description}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
