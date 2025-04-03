import { ActionButton } from '@/components/ActionButton';
import { AppSidebar } from '@/components/AppSidebar';
import { AppTopBar } from '@/components/AppTopBar';
import SchedulesList from '@/components/SchedulesList';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Schedules = ({ isEmbedded = false }) => {
  const { selectedTeam } = useAuth();
  const navigate = useNavigate();

  if (!selectedTeam) {
    return <div>Porfavor, selecione um time.</div>;
  }

  const handleCreate = () => {
    navigate('/schedules/create');
  };

  const content = (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Escalas</h2>
        <ActionButton
          permission="CreateSchedules"
          tooltip="Criar Escala"
          onClick={handleCreate}
        >
          <Plus className="h-4 w-4" />
        </ActionButton>
      </div>
      <SchedulesList />
    </>
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppTopBar />
          <main className="flex-1 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Escalas</h1>
                <p className="text-muted-foreground">Gerencie suas escalas</p>
              </div>
            </div>
            {content}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Schedules;
