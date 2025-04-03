import {
  Assigned,
  AssignedCreateRequest,
  AssignedResponse,
  SingleAssignedResponse,
} from '@/types/assigned';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5199/api';

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Get all assigned
export const fetchAllAssigned = async (teamId: number): Promise<Assigned[]> => {
  const response = await fetch(`${API_URL}/teams/${teamId}/Assigned`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch assigned tasks');
  }

  const data: AssignedResponse = await response.json();
  return data.data.$values || [];
};

// Get assigned by id
export const fetchAssignedById = async (
  teamId: number,
  id: number
): Promise<Assigned> => {
  const response = await fetch(`${API_URL}/teams/${teamId}/Assigned/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch assigned task');
  }

  const data: SingleAssignedResponse = await response.json();
  return data.data;
};

// Create new assigned
export const createAssigned = async (
  teamId: number,
  assigned: AssignedCreateRequest
): Promise<Assigned> => {
  const response = await fetch(`${API_URL}/teams/${teamId}/Assigned`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(assigned),
  });

  if (!response.ok) {
    throw new Error('Failed to create assigned task');
  }

  const data = await response.json();
  return data.data;
};

// Delete assigned
export const deleteAssigned = async (
  teamId: number,
  id: number
): Promise<void> => {
  const response = await fetch(`${API_URL}/teams/${teamId}/Assigned/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete assigned task');
  }
};

// Get assigned by schedule id
export const fetchAssignedByScheduleId = async (
  teamId: number,
  scheduleId: number
): Promise<Assigned[]> => {
  const response = await fetch(
    `${API_URL}/teams/${teamId}/Assigned/schedule/${scheduleId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch assigned tasks by schedule');
  }

  const data: AssignedResponse = await response.json();
  return data.data.$values || [];
};

// Get assigned by user id
export const fetchAssignedByUserId = async (
  teamId: number,
  userId: number
): Promise<Assigned[]> => {
  const response = await fetch(
    `${API_URL}/teams/${teamId}/Assigned/user/${userId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user's assigned tasks");
  }

  const data: AssignedResponse = await response.json();
  return data.data.$values || [];
};
