
import { TeamResponse, Team } from "@/types/team";

// Function to fetch all teams
export const fetchTeams = async (): Promise<Team[]> => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch("http://localhost:5199/api/Team", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch teams");
    }

    const data: TeamResponse = await response.json();
    return data.data.$values || [];
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};

// Function to fetch a specific team by ID
export const fetchTeamById = async (id: number): Promise<Team> => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`http://localhost:5199/api/Team/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch team");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching team with ID ${id}:`, error);
    throw error;
  }
};

// Function to create a new team
export const createTeam = async (team: Omit<Team, "id">): Promise<Team> => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch("http://localhost:5199/api/Team", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(team),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create team");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error creating team:", error);
    throw error;
  }
};

// Function to update a team
export const updateTeam = async (id: number, team: Partial<Team>): Promise<Team> => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`http://localhost:5199/api/Team/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(team),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update team");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error updating team with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete a team
export const deleteTeam = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`http://localhost:5199/api/Team/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete team");
    }
  } catch (error) {
    console.error(`Error deleting team with ID ${id}:`, error);
    throw error;
  }
};

// Function to fetch team members
export const fetchTeamMembers = async (teamId: number): Promise<any[]> => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`http://localhost:5199/api/Team/${teamId}/members`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch team members");
    }

    const data = await response.json();
    return data.data.$values || [];
  } catch (error) {
    console.error(`Error fetching members for team with ID ${teamId}:`, error);
    throw error;
  }
};

// Function to add a member to a team
export const addTeamMember = async (teamId: number, userData: any): Promise<any> => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`http://localhost:5199/api/Team/${teamId}/members`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add team member");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error adding member to team with ID ${teamId}:`, error);
    throw error;
  }
};

// Function to remove a member from a team
export const removeTeamMember = async (teamId: number, userId: number): Promise<void> => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`http://localhost:5199/api/Team/${teamId}/members/${userId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to remove team member");
    }
  } catch (error) {
    console.error(`Error removing user ${userId} from team ${teamId}:`, error);
    throw error;
  }
};

// Function to update a member's role in a team
export const updateMemberRole = async (teamId: number, userId: number, role: string): Promise<any> => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`http://localhost:5199/api/Team/${teamId}/members/${userId}/role`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update member role");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error updating role for user ${userId} in team ${teamId}:`, error);
    throw error;
  }
};

// Function to fetch user's teams
export const fetchMyTeams = async (): Promise<Team[]> => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch("http://localhost:5199/api/Team/my-teams", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch my teams");
    }

    const data = await response.json();
    return data.data.$values || [];
  } catch (error) {
    console.error("Error fetching my teams:", error);
    throw error;
  }
};
