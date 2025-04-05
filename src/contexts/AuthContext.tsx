import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  username: string;
  isAuthenticated: boolean;
  id: string;
  idToken: string;
}

interface AuthContextType {
  user: User;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const initialUser: User = {
  username: "",
  isAuthenticated: false,
  id: "",
  idToken: "",
};

const AuthContext = createContext<AuthContextType>({
  user: initialUser,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : initialUser;
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const login = async (
    loginName: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await fetch("https://chiquoc26.id.vn/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loginName, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      setUser({
        username: data.user.yourName,
        isAuthenticated: true,
        id: data.user.loginName,
        idToken: data.user.id,
      });
      toast.success("Login successful");
      return true;
    } catch (error) {
      toast.error(error.message || "An error occurred during login");
      return false;
    }
  };

  const logout = () => {
    setUser(initialUser);
    navigate("/login");
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
