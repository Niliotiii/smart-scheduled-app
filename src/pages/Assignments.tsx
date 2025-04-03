import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAssignments } from "@/services/assignmentService";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import MainNavbar from "@/components/MainNavbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ClipboardList, Pencil, Eye, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const Assignments = () => {
  const { selectedTeam } = useAuth();
  const navigate = useNavigate();

  const {
    data: assignments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["assignments", selectedTeam?.id],
    queryFn: () => fetchAssignments(selectedTeam!.id),
    enabled: !!selectedTeam,
  });

  if (!selectedTeam) {
    return <div>Please select a team.</div>;
  }

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="outline">Draft</Badge>;
      case 1:
        return <Badge variant="secondary">In Progress</Badge>;
      case 2:
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full flex-col">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <MainNavbar />
            <main className="flex-1 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Assignments</h1>
                  <p className="text-muted-foreground">Manage your team assignments</p>
                </div>
                <Button onClick={() => navigate("/assignments/create")}>
                  <Plus className="mr-2 h-4 w-4" /> Create Assignment
                </Button>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full flex-col">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <MainNavbar />
            <main className="flex-1 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Assignments</h1>
                  <p className="text-muted-foreground">Manage your team assignments</p>
                </div>
                <Button onClick={() => navigate("/assignments/create")}>
                  <Plus className="mr-2 h-4 w-4" /> Create Assignment
                </Button>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center text-red-500">
                    <p>Error loading assignments</p>
                  </div>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full flex-col">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <MainNavbar />
          <main className="flex-1 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Assignments</h1>
                <p className="text-muted-foreground">Manage your team assignments</p>
              </div>
              <Button onClick={() => navigate("/assignments/create")}>
                <Plus className="mr-2 h-4 w-4" /> Create Assignment
              </Button>
            </div>
            
            {assignments && assignments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.title}</TableCell>
                      <TableCell>{assignment.description}</TableCell>
                      <TableCell>{getStatusBadge(assignment.status || 0)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/assignments/${assignment.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/assignments/${assignment.id}/edit`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No assignments found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Create your first assignment to get started
                    </p>
                    <Button
                      onClick={() => navigate("/assignments/create")}
                      className="mt-4"
                    >
                      Create Assignment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Assignments;
