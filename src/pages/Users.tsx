
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, User } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UsersProps {
  isEmbedded?: boolean;
}

const Users: React.FC<UsersProps> = ({ isEmbedded = false }) => {
  const navigate = useNavigate();
  
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      }
    }
  });

  const handleCreate = () => {
    navigate("/users/create");
  };

  const handleView = (id: number) => {
    navigate(`/users/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/users/${id}/edit`);
  };

  const content = (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Users List</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No users found.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleView(user.id)}
                    >
                      <User className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(user.id)}
                    >
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full flex-col">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <main className="flex-1 p-6">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Manage system users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {content}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Users;
