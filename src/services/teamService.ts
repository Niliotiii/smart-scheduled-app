
import { TeamResponse, Team } from "@/types/team";

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
