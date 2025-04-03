import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import MainNavbar from "@/components/MainNavbar";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Assignment } from "@/types/assignment";
import { getAssignments } from "@/services/assignmentService";
import { toast } from "@/components/ui/use-toast";
import { Edit, Trash2 } from "lucide-react";

const Assignments = () => {
  const { selectedTeam } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedTeam) {
      fetchAssignments();
    }
  }, [selectedTeam]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const fetchedAssignments = await getAssignments(selectedTeam!.id);
      setAssignments(fetchedAssignments);
    } catch (error) {
      toast({
        title: "Error fetching assignments",
        description: "Failed to load assignments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/assignments/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    // Implement delete logic here
    console.log(`Delete assignment with ID: ${id}`);
  };

  if (loading) {
    return <div>Loading assignments...</div>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full flex-col">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <MainNavbar />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Assignments</h1>
              <p className="text-muted-foreground">
                Manage and view all assignments
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Button onClick={() => navigate("/assignments/create")}>
                  Create Assignment
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.id}</TableCell>
                        <TableCell>{assignment.title}</TableCell>
                        <TableCell>{assignment.description}</TableCell>
                        <TableCell>{assignment.dueDate}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(assignment.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(assignment.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Assignments;
