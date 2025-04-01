
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { loginUser } from "@/services/authService";
import { Team } from "@/types/team";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  selectedTeam: Team | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  selectTeam: (team: Team) => void;
  clearTeamSelection: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  selectedTeam: null,
  login: async () => {},
  logout: () => {},
  selectTeam: () => {},
  clearTeamSelection: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    // Verificar se há um token salvo no localStorage ao carregar a página
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    const teamData = localStorage.getItem("selectedTeam");
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }

    if (teamData) {
      setSelectedTeam(JSON.parse(teamData));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await loginUser(username, password);
    
    if (!response.success) {
      throw new Error(response.error || "Falha na autenticação");
    }
    
    // Aqui você pode decodificar o token JWT, se necessário
    const mockUser = { username, id: 1, role: "user" };
    
    localStorage.setItem("authToken", response.token || "");
    localStorage.setItem("userData", JSON.stringify(mockUser));
    
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("selectedTeam");
    setUser(null);
    setIsAuthenticated(false);
    setSelectedTeam(null);
  };

  const selectTeam = (team: Team) => {
    localStorage.setItem("selectedTeam", JSON.stringify(team));
    setSelectedTeam(team);
  };

  const clearTeamSelection = () => {
    localStorage.removeItem("selectedTeam");
    setSelectedTeam(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        selectedTeam,
        login, 
        logout,
        selectTeam,
        clearTeamSelection
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
