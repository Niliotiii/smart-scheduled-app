import ProtectedRoute from '@/components/ProtectedRoute';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Admin from './pages/Admin';
import AssignmentCreate from './pages/AssignmentCreate';
import AssignmentEdit from './pages/AssignmentEdit';
import Assignments from './pages/Assignments';
import AssignmentView from './pages/AssignmentView';
import CreateTeam from './pages/CreateTeam';
import EditTeam from './pages/EditTeam';
import Index from './pages/Index';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ScheduleCreate from './pages/ScheduleCreate';
import ScheduleEdit from './pages/ScheduleEdit';
import Schedules from './pages/Schedules';
import ScheduleView from './pages/ScheduleView';
import TeamInvites from './pages/TeamInvites';
import TeamMembers from './pages/TeamMembers';
import Teams from './pages/Teams';
import TeamSelection from './pages/TeamSelection';
import TeamView from './pages/TeamView';
import UserCreate from './pages/UserCreate';
import UserEdit from './pages/UserEdit';
import UserInvites from './pages/UserInvites';
import UserProfile from './pages/UserProfile';
import Users from './pages/Users';
import UserView from './pages/UserView';

// Create a client
const queryClient = new QueryClient();

// Wrap the content in SidebarProvider for protected routes
const ProtectedContent = ({ children, requireTeam = false }) => (
  <ProtectedRoute requireTeam={requireTeam}>
    <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>
  </ProtectedRoute>
);

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/team-selection"
                  element={
                    <ProtectedRoute>
                      <TeamSelection />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <Index />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/teams"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <Teams />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/teams/create"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <CreateTeam />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/teams/:id"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <TeamView />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/teams/:id/edit"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <EditTeam />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/teams/:id/members"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <TeamMembers />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/teams/:id/invites"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <TeamInvites />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/user-invites"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <UserInvites />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <UserProfile />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <Admin />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <Users />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/users/create"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <UserCreate />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/users/:id"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <UserView />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/users/:id/edit"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <UserEdit />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/assignments"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <Assignments />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/assignments/create"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <AssignmentCreate />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/assignments/:id"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <AssignmentView />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/assignments/:id/edit"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <AssignmentEdit />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/schedules"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <Schedules />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/schedules/create"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <ScheduleCreate />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/schedules/:id"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <ScheduleView />
                    </ProtectedContent>
                  }
                />
                <Route
                  path="/schedules/:id/edit"
                  element={
                    <ProtectedContent requireTeam={true}>
                      <ScheduleEdit />
                    </ProtectedContent>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
