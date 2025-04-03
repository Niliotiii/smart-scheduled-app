import { RenderPermissions } from '@/types/permissions';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5199/api';

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const permissionService = {
  getRenderPermissions: async (
    teamId?: string | number
  ): Promise<RenderPermissions> => {
    const url = teamId
      ? `${API_URL}/Render/render?selectedTeam=${teamId}`
      : `${API_URL}/Render/render`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch permissions');
    }

    return response.json();
  },
};
