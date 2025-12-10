// Contexto de Autenticação integrado com o backend
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, userApi, User, ApiError } from "../lib/api";
import { useToast } from "../hooks/use-toast";
import { AxiosError } from "axios";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  updateUserProfile: (data: UpdateProfileData) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  deleteAvatar: () => Promise<void>;
  saveReturnUrl: (url: string) => void;
  getReturnUrl: () => string | null;
}

interface UpdateProfileData {
  name?: string;
  phone?: string;
  location?: string;
  bio?: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  type: "candidato" | "empresa";
  companyName?: string;
  nif?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isAuthenticated = !!user;

  // Verificar se token ainda é válido ao carregar
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedUser = localStorage.getItem("user");
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  }, []);

  const handleApiError = (error: unknown) => {
    if (error instanceof AxiosError) {
      const apiError = error.response?.data as ApiError;
      toast({
        variant: "destructive",
        title: "Erro",
        description: apiError?.message || "Ocorreu um erro. Tente novamente.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
      });
    }
  };

  const saveReturnUrl = (url: string) => {
    sessionStorage.setItem("returnUrl", url);
  };

  const getReturnUrl = (): string | null => {
    return sessionStorage.getItem("returnUrl");
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(email, password);
      
      // Guardar tokens e user
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      setUser(response.user);

      toast({
        title: "Login efetuado!",
        description: `Bem-vindo de volta, ${response.user.name}!`,
      });

      // Verificar se há returnUrl salvo
      const returnUrl = sessionStorage.getItem("returnUrl");
      if (returnUrl) {
        sessionStorage.removeItem("returnUrl");
        window.location.href = returnUrl;
        return;
      }

      // Redirecionar baseado no tipo de utilizador
      const redirectPath = 
        response.user.type === "CANDIDATO" ? "/candidato/dashboard" :
        response.user.type === "EMPRESA" ? "/empresa/dashboard" :
        "/admin/dashboard";
      
      window.location.href = redirectPath;
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(data);
      
      // Guardar tokens e user
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      setUser(response.user);

      toast({
        title: "Registo efetuado!",
        description: response.message,
      });

      // Redirecionar baseado no tipo
      if (response.user.type === "EMPRESA" && response.user.status === "PENDING") {
        // Empresa pendente - mostrar mensagem
        window.location.href = "/auth/pending-approval";
      } else {
        // Verificar se há returnUrl salvo
        const returnUrl = sessionStorage.getItem("returnUrl");
        if (returnUrl) {
          sessionStorage.removeItem("returnUrl");
          window.location.href = returnUrl;
          return;
        }

        const redirectPath = 
          response.user.type === "CANDIDATO" ? "/candidato/dashboard" :
          "/empresa/dashboard";
        
        window.location.href = redirectPath;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      
      setUser(null);
      
      toast({
        title: "Logout efetuado",
        description: "Até breve!",
      });

      window.location.href = "/";
    } catch (error) {
      // Mesmo com erro, fazer logout local
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/";
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.forgotPassword(email);
      
      toast({
        title: "Email enviado",
        description: response.message,
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.resetPassword(token, password);
      
      toast({
        title: "Password alterada",
        description: response.message,
      });

      // Redirecionar para login
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    try {
      const updatedUser = await userApi.getProfile();
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error refreshing profile:", error);
      throw error;
    }
  };

  const updateUserProfile = async (data: UpdateProfileData) => {
    setIsLoading(true);
    try {
      const updatedUser = await userApi.updateProfile(data);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast({
        title: "Perfil atualizado",
        description: "As suas alterações foram guardadas com sucesso.",
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    setIsLoading(true);
    try {
      const updatedUser = await userApi.uploadAvatar(file);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast({
        title: "Avatar atualizado",
        description: "A sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAvatar = async () => {
    setIsLoading(true);
    try {
      const updatedUser = await userApi.deleteAvatar();
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast({
        title: "Avatar removido",
        description: "A sua foto de perfil foi removida.",
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        refreshUserProfile,
        updateUserProfile,
        uploadAvatar,
        deleteAvatar,
        saveReturnUrl,
        getReturnUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

