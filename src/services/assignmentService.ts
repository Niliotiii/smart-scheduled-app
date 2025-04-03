import {
  Assignment,
  AssignmentCreateRequest,
  AssignmentMembersResponse,
  AssignmentResponse,
  AssignmentUpdateRequest,
  SingleAssignmentResponse,
} from '@/types/assignment';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5199/api';

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Get all assignments for a team
export const fetchAssignments = async (
  teamId: string | number
): Promise<Assignment[]> => {
  const response = await fetch(`${API_URL}/teams/${teamId}/Assignment`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch assignments');
  }

  const result: AssignmentResponse = await response.json();
  return result.data.$values;
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

  const result: SingleAssignmentResponse = await response.json();
  return result.data;
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

  const result: SingleAssignmentResponse = await response.json();
  return result.data;
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

  const result: SingleAssignmentResponse = await response.json();
  return result.data;
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

  const result: AssignmentMembersResponse = await response.json();
  return result;
};
