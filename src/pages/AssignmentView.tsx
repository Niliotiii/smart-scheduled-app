
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAssignmentById, fetchAssignmentMembers } from "@/services/assignmentService";
import { AppSidebar } from "@/components/AppSidebar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, ArrowLeft, Users } from "lucide-react";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const AssignmentView = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedTeam } = useAuth();
  const navigate = useNavigate();
  const teamId = selectedTeam?.id;
  const assignmentId = id ? parseInt(id) : undefined;

  const { data: assignment, isLoading: isLoadingAssignment, error: assignmentError } = useQuery({
    queryKey: ["assignment", teamId, assignmentId],
    queryFn: () => teamId && assignmentId 
      ? fetchAssignmentById(teamId, assignmentId) 
      : Promise.reject("Invalid assignment ID or team ID"),
    enabled: !!teamId && !!assignmentId,
  });

  const { data: membersResponse, isLoading: isLoadingMembers, error: membersError } = useQuery({
    queryKey: ["assignmentMembers", teamId, assignmentId],
    queryFn: () => teamId && assignmentId 
      ? fetchAssignmentMembers(teamId, assignmentId) 
      : Promise.reject("Invalid assignment ID or team ID"),
    enabled: !!teamId && !!assignmentId,
  });

  const members = membersResponse?.data?.$values || [];
  const isLoading = isLoadingAssignment || isLoadingMembers;
  const error = assignmentError || membersError;

  if (isLoading) return <div className="p-8">Loading assignment...</div>;
  if (error) return <div className="p-8">Error loading assignment: {(error as Error).message}</div>;
  if (!assignment) return <div className="p-8">Assignment not found</div>;

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/assignments")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Assignment Details</h1>
          </div>
          <Button onClick={() => navigate(`/assignments/${assignmentId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Assignment
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>{assignment.title}</CardTitle>
              <CardDescription>
                Created on {new Date(assignment.createdAt).toLocaleDateString()} | 
                Last updated on {new Date(assignment.updatedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{assignment.description}</p>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Assignment Members</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <p className="text-muted-foreground">No members assigned to this assignment</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member, index) => (
                      <TableRow key={index}>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.roleName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate(`/assignments/${assignmentId}/members`)}>
                <Users className="mr-2 h-4 w-4" /> Manage Members
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssignmentView;
