
import { User, UserUpdateRequest, UserCreateRequest, UserResponse, TeamResponse, PermissionResponse, ScheduleResponse } from "@/types/user";
import { Team } from "@/types/team";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5199/api";

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Get all users
export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_URL}/User`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data: UserResponse = await response.json();
  return data.data.$values;
};

// Get user by id
export const fetchUserById = async (id: number): Promise<User> => {
  const response = await fetch(`${API_URL}/User/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  const data = await response.json();
  return data.data;
};

// Create new user
export const createUser = async (user: UserCreateRequest): Promise<User> => {
  const response = await fetch(`${API_URL}/User`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  const data = await response.json();
  return data.data;
};

// Update user
export const updateUser = async (id: number, user: UserUpdateRequest): Promise<User> => {
  const response = await fetch(`${API_URL}/User/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  const data = await response.json();
  return data.data;
};

// Delete user
export const deleteUser = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/User/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
};

// Get user teams
export const fetchUserTeams = async (id: number): Promise<TeamResponse> => {
  const response = await fetch(`${API_URL}/User/${id}/teams`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user teams");
  }

  const data = await response.json();
  return data;
};

// Get user permissions
export const fetchUserPermissions = async (id: number): Promise<PermissionResponse> => {
  const response = await fetch(`${API_URL}/User/${id}/permissions`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user permissions");
  }

  const data = await response.json();
  return data;
};

// Get user schedules
export const fetchUserSchedules = async (id: number): Promise<ScheduleResponse> => {
  const response = await fetch(`${API_URL}/User/${id}/schedules`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user schedules");
  }

  const data = await response.json();
  return data;
};

// Add a team member
export const addTeamMember = async (teamId: number, userId: number, role: string): Promise<any> => {
  const response = await fetch(`${API_URL}/Team/${teamId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify({
      userId,
      role
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add team member");
  }

  const data = await response.json();
  return data.data;
};

// Get all teams
export const fetchTeams = async (): Promise<Team[]> => {
  const response = await fetch(`${API_URL}/Team`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch teams");
  }

  const data = await response.json();
  return data.data.$values || [];
};

// Get team by id
export const fetchTeamById = async (id: number): Promise<Team> => {
  const response = await fetch(`${API_URL}/Team/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch team");
  }

  const data = await response.json();
  return data.data;
};

// Get team members
export const fetchTeamMembers = async (id: number): Promise<any[]> => {
  const response = await fetch(`${API_URL}/Team/${id}/members`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch team members");
  }

  const data = await response.json();
  return data.data.$values || [];
};

// Create new team
export const createTeam = async (team: { name: string; description: string }): Promise<Team> => {
  const response = await fetch(`${API_URL}/Team`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(team),
  });

  if (!response.ok) {
    throw new Error("Failed to create team");
  }

  const data = await response.json();
  return data.data;
};

// Update team
export const updateTeam = async (id: number, team: { name: string; description: string }): Promise<Team> => {
  const response = await fetch(`${API_URL}/Team/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(team),
  });

  if (!response.ok) {
    throw new Error("Failed to update team");
  }

  const data = await response.json();
  return data.data;
};

// Delete team
export const deleteTeam = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/Team/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete team");
  }
};
