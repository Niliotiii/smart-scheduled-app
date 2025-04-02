
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import TeamSelection from "./pages/TeamSelection";
import Teams from "./pages/Teams";
import CreateTeam from "./pages/CreateTeam";
import EditTeam from "./pages/EditTeam";
import TeamMembers from "./pages/TeamMembers";
import TeamMemberAdd from "./pages/TeamMemberAdd";
import TeamInvites from "./pages/TeamInvites";
import Invites from "./pages/Invites";
import UserInvites from "./pages/UserInvites";
import Users from "./pages/Users";
import UserView from "./pages/UserView";
import UserEdit from "./pages/UserEdit";
import UserCreate from "./pages/UserCreate";

const queryClient = new QueryClient();

const App = () => (
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
                <ProtectedRoute requireTeam={true}>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teams" 
              element={
                <ProtectedRoute requireTeam={true}>
                  <Teams />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teams/create" 
              element={
                <ProtectedRoute requireTeam={true}>
                  <CreateTeam />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teams/:id/edit" 
              element={
                <ProtectedRoute requireTeam={true}>
                  <EditTeam />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teams/:id/members" 
              element={
                <ProtectedRoute requireTeam={true}>
                  <TeamMembers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teams/:id/members/add" 
              element={
                <ProtectedRoute requireTeam={true}>
                  <TeamMemberAdd />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teams/:id/invites" 
              element={
                <ProtectedRoute requireTeam={true}>
                  <TeamInvites />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/invites" 
              element={
                <ProtectedRoute requireTeam={true}>
                  <Invites />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user-invites" 
              element={
                <ProtectedRoute requireTeam={true}>
                  <UserInvites />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute requireTeam={true}>
                  <Users />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users/create" 
              element={
                <ProtectedRoute requireTeam={true}>
                  <UserCreate />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users/:id" 
              element={
                <ProtectedRoute requireTeam={true}>
                  <UserView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users/:id/edit" 
              element={
                <ProtectedRoute requireTeam={true}>
                  <UserEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assignments" 
              element={
                <ProtectedRoute requireTeam={true}>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assign" 
              element={
                <ProtectedRoute requireTeam={true}>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/schedules" 
              element={
                <ProtectedRoute requireTeam={true}>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
