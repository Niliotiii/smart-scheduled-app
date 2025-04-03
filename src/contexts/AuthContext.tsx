import { loginUser } from '@/services/authService';
import { Team } from '@/types/team';
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
  userTeamRule?: number;
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
  userTeamRule: undefined,
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
  const [token, setToken] = useState<string | null>(null);
  const [userTeamRule, setUserTeamRule] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    // Check for saved token in localStorage
    const storedToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    const teamData = localStorage.getItem('selectedTeam');
    const ruleData = localStorage.getItem('userTeamRule');

    if (storedToken && userData) {
      setToken(storedToken);
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }

    if (teamData) {
      setSelectedTeam(JSON.parse(teamData));
    }

    if (ruleData) {
      setUserTeamRule(Number(ruleData));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await loginUser(username, password);

    if (!response.success) {
      throw new Error(response.error || 'Authentication failed');
    }

    const actualToken = response.access_token || response.token;

    if (!actualToken) {
      throw new Error('Token not found in response');
    }

    // Clear any existing data
    localStorage.removeItem('selectedTeam');
    localStorage.removeItem('userTeamRule');

    // Set new auth data
    localStorage.setItem('authToken', actualToken);
    localStorage.setItem(
      'userData',
      JSON.stringify({ username, id: 1, role: 'user' })
    );

    setToken(actualToken);
    setUser({ username, id: 1, role: 'user' });
    setIsAuthenticated(true);
    setSelectedTeam(null);
    setUserTeamRule(undefined);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('selectedTeam');
    localStorage.removeItem('userTeamRule');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setSelectedTeam(null);
    setUserTeamRule(undefined);
  };

  const selectTeam = (team: Team) => {
    localStorage.setItem('selectedTeam', JSON.stringify(team));
    setSelectedTeam(team);

    // For demo purposes, set a default userTeamRule when selecting a team
    // In a real app, this would come from API call based on user's role in the team
    const mockUserTeamRule = team.id % 4; // Just a simple way to create different roles for testing
    localStorage.setItem('userTeamRule', mockUserTeamRule.toString());
    setUserTeamRule(mockUserTeamRule);
  };

  const clearTeamSelection = () => {
    localStorage.removeItem('selectedTeam');
    localStorage.removeItem('userTeamRule');
    setSelectedTeam(null);
    setUserTeamRule(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        selectedTeam,
        token,
        userTeamRule,
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
