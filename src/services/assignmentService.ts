import {
  AssignmentCreateRequest,
  AssignmentMembersResponse,
  AssignmentUpdateRequest,
  SingleAssignmentResponse,
} from '@/types/assignment';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5199/api';

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

interface Assignment {
  id: string | number;
  title: string;
  description: string;
}

// Get all assignments for a team
export const fetchAssignments = async (
  teamId: string | number
): Promise<Assignment[]> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/assignments?teamId=${teamId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch assignments');
  }

  return response.json();
};

// Get assignment by id
export const fetchAssignmentById = async (
  teamId: number,
  id: number
): Promise<Assignment> => {
  const response = await fetch(`${API_URL}/teams/${teamId}/Assignment/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch assignment');
  }

  const data: SingleAssignmentResponse = await response.json();
  return data.data;
};

// Create new assignment
export const createAssignment = async (
  teamId: number,
  assignment: AssignmentCreateRequest
): Promise<Assignment> => {
  const response = await fetch(`${API_URL}/teams/${teamId}/Assignment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(assignment),
  });

  if (!response.ok) {
    throw new Error('Failed to create assignment');
  }

  const data = await response.json();
  return data.data;
};

// Update assignment
export const updateAssignment = async (
  teamId: number,
  id: number,
  assignment: AssignmentUpdateRequest
): Promise<Assignment> => {
  const response = await fetch(`${API_URL}/teams/${teamId}/Assignment/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(assignment),
  });

  if (!response.ok) {
    throw new Error('Failed to update assignment');
  }

  const data = await response.json();
  return data.data;
};

// Delete assignment
export const deleteAssignment = async (
  teamId: number,
  id: number
): Promise<void> => {
  const response = await fetch(`${API_URL}/teams/${teamId}/Assignment/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete assignment');
  }
};

// Get assignment members
export const fetchAssignmentMembers = async (
  teamId: number,
  id: number
): Promise<AssignmentMembersResponse> => {
  const response = await fetch(
    `${API_URL}/teams/${teamId}/Assignment/${id}/members`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch assignment members');
  }

  const data = await response.json();
  return data;
};
