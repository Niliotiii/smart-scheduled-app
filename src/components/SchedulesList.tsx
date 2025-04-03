
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchSchedules } from "@/services/scheduleService";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Pencil, Trash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SchedulesList = () => {
  const { selectedTeam } = useAuth();
  const navigate = useNavigate();

  const {
    data: schedules,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["schedules", selectedTeam?.id],
    queryFn: () => fetchSchedules(selectedTeam!.id),
    enabled: !!selectedTeam,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-red-500">
            <p>Error loading schedules</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!schedules || schedules.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No schedules found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first schedule to get started
            </p>
            <Button
              onClick={() => navigate("/schedules/create")}
              className="mt-4"
            >
              Create Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedules.map((schedule) => (
          <TableRow key={schedule.id}>
            <TableCell className="font-medium">{schedule.title}</TableCell>
            <TableCell>{schedule.description}</TableCell>
            <TableCell>
              {format(new Date(schedule.startDate), "PPP")}
            </TableCell>
            <TableCell>{format(new Date(schedule.endDate), "PPP")}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(`/schedules/${schedule.id}`)}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(`/schedules/${schedule.id}/edit`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SchedulesList;
