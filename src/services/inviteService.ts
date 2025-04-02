
import { Invite, InviteCreateRequest, InviteResponse, SingleInviteResponse } from "@/types/invite";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5199/api";

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Get all invites
export const fetchInvites = async (): Promise<Invite[]> => {
  const response = await fetch(`${API_URL}/Invite`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch invites");
  }

  const data: InviteResponse = await response.json();
  return data.data.$values || [];
};

// Get pending invites
export const fetchPendingInvites = async (): Promise<Invite[]> => {
  const response = await fetch(`${API_URL}/Invite/pending`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pending invites");
  }

  const data: InviteResponse = await response.json();
  return data.data.$values || [];
};

// Get user pending invites
export const fetchUserPendingInvites = async (userId: number): Promise<Invite[]> => {
  const response = await fetch(`${API_URL}/Invite/user/${userId}/pending`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user pending invites");
  }

  const data: InviteResponse = await response.json();
  return data.data.$values || [];
};

// Get team invites
export const fetchTeamInvites = async (teamId: number): Promise<Invite[]> => {
  const response = await fetch(`${API_URL}/Invite/team/${teamId}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch team invites");
  }

  const data: InviteResponse = await response.json();
  return data.data.$values || [];
};

// Get invite by ID
export const fetchInviteById = async (id: number): Promise<Invite> => {
  const response = await fetch(`${API_URL}/Invite/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch invite");
  }

  const data: SingleInviteResponse = await response.json();
  return data.data;
};

// Create invite
export const createInvite = async (invite: InviteCreateRequest): Promise<Invite> => {
  const response = await fetch(`${API_URL}/Invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(invite),
  });

  if (!response.ok) {
    throw new Error("Failed to create invite");
  }

  const data: SingleInviteResponse = await response.json();
  return data.data;
};

// Accept invite
export const acceptInvite = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/Invite/${id}/accept`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to accept invite");
  }
};

// Reject invite
export const rejectInvite = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/Invite/${id}/reject`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to reject invite");
  }
};

// Delete invite
export const deleteInvite = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/Invite/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete invite");
  }
};
