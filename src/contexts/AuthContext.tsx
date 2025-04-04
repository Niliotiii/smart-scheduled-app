import { loginUser } from '@/services/authService';
import { Team } from '@/types/team';
import { UserData } from '@/types/user';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  selectedTeam: Team | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  selectTeam: (team: Team) => void;
  clearTeamSelection: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  selectedTeam: null,
  token: null,
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const teamData = localStorage.getItem('selectedTeam');
    const userData = localStorage.getItem('userData');

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }

    if (teamData) {
      setSelectedTeam(JSON.parse(teamData));
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5199/api/User/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: '*/*',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const result = await response.json();
      const userData = result.data;

      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  const login = async (username: string, password: string) => {
    const response = await loginUser(username, password);

    if (!response.success) {
      throw new Error(response.error || 'Authentication failed');
    }

    const actualToken = response.access_token || response.token;

    if (!actualToken) {
      throw new Error('Token not found in response');
    }

    localStorage.removeItem('selectedTeam');
    localStorage.setItem('authToken', actualToken);
    setToken(actualToken);
    setIsAuthenticated(true);
    setSelectedTeam(null);

    await fetchUserData(actualToken);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('selectedTeam');
    setToken(null);
    setIsAuthenticated(false);
    setSelectedTeam(null);
    setUser(null);
  };

  const selectTeam = (team: Team) => {
    localStorage.setItem('selectedTeam', JSON.stringify(team));
    setSelectedTeam(team);
  };

  const clearTeamSelection = () => {
    localStorage.removeItem('selectedTeam');
    setSelectedTeam(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        selectedTeam,
        token,
        login,
        logout,
        selectTeam,
        clearTeamSelection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
