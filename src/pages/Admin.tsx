import { AppSidebar } from '@/components/AppSidebar';
import { AppTopBar } from '@/components/AppTopBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import Teams from './Teams';
import Users from './Users';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('teams');

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppTopBar />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Painel do Administrador</h1>
              <p className="text-muted-foreground">
                Configure times e usuários
              </p>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-6">
                <TabsTrigger value="teams">Times</TabsTrigger>
                <TabsTrigger value="users">Usuários</TabsTrigger>
              </TabsList>

              <TabsContent value="teams" className="w-full">
                <Teams isEmbedded={true} />
              </TabsContent>

              <TabsContent value="users" className="w-full">
                <Users isEmbedded={true} />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
