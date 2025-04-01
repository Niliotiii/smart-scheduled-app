
interface LoginResponse {
  success: boolean;
  token?: string;
  access_token?: string;
  error?: string;
}

export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch("http://localhost:5199/api/Auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.message || "Erro ao fazer login"
      };
    }

    const data = await response.json();
    return { 
      success: true, 
      token: data.access_token || data.token,
      access_token: data.access_token
    };
  } catch (error) {
    console.error("Erro na requisição:", error);
    return { 
      success: false, 
      error: "Erro de conexão com o servidor"
    };
  }
};
