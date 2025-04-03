
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";

const Index = () => {
  const { selectedTeam } = useAuth();

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Welcome to {selectedTeam?.name}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              You are authenticated and can access all features for this team.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <p className="text-gray-600">
              Team Description: {selectedTeam?.description}
            </p>
            <p className="mt-4 text-gray-600">
              Use the sidebar menu to navigate through different sections of the application.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
