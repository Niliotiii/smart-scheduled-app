import { AppSidebar } from '@/components/AppSidebar';
import { AppTopBar } from '@/components/AppTopBar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import UserInvites from './UserInvites';

const UserProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('profile');

  const getInitials = (name: string) => {
    console.log(user);
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppTopBar />
          <main className="flex-1 p-6">
            <CardHeader>
              <CardTitle>Meu Perfil {user.id}</CardTitle>
              <CardDescription>
                Visualize e gerencie o seu perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">Perfil</TabsTrigger>
                  <TabsTrigger value="invites">Meus Convites</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="w-full">
                  <div className="flex flex-col gap-6 p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback>
                          {user?.name ? getInitials(user.name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-xl font-semibold">{user?.name}</h2>
                        <p className="text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div>
                        <h3 className="text-lg font-medium">User ID</h3>
                        <p>{user?.id}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="invites" className="w-full">
                  <UserInvites isEmbedded={true} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserProfile;
