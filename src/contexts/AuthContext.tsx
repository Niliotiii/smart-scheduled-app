
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { loginUser } from "@/services/authService";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Verificar se há um token salvo no localStorage ao carregar a página
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
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
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
