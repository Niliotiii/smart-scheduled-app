
import { Schedule, ScheduleCreateRequest, ScheduleUpdateRequest, ScheduleResponse, SingleScheduleResponse } from "@/types/schedule";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5199/api";

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Get all schedules for a team
export const fetchSchedules = async (teamId: number): Promise<Schedule[]> => {
  const response = await fetch(`${API_URL}/teams/${teamId}/Schedule`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to fetch schedules:", errorText);
    throw new Error("Failed to fetch schedules");
  }

  const data: ScheduleResponse = await response.json();
  return data.data.$values || [];
};

// Get schedule by id
export const fetchScheduleById = async (teamId: number, id: number): Promise<Schedule> => {
  const response = await fetch(`${API_URL}/teams/${teamId}/Schedule/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to fetch schedule with ID ${id}:`, errorText);
    throw new Error("Failed to fetch schedule");
  }

  const data: SingleScheduleResponse = await response.json();
  return data.data;
};

// Create new schedule
export const createSchedule = async (teamId: number, schedule: ScheduleCreateRequest): Promise<Schedule> => {
  const response = await fetch(`${API_URL}/teams/${teamId}/Schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(schedule),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to create schedule:", errorText);
    throw new Error("Failed to create schedule");
  }

  const data = await response.json();
  return data.data;
};

// Update schedule
export const updateSchedule = async (teamId: number, id: number, schedule: ScheduleUpdateRequest): Promise<Schedule> => {
  const response = await fetch(`${API_URL}/teams/${teamId}/Schedule/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(schedule),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to update schedule with ID ${id}:`, errorText);
    throw new Error("Failed to update schedule");
  }

  const data = await response.json();
  return data.data;
};

// Delete schedule
export const deleteSchedule = async (teamId: number, id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/teams/${teamId}/Schedule/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to delete schedule with ID ${id}:`, errorText);
    throw new Error("Failed to delete schedule");
  }
};
