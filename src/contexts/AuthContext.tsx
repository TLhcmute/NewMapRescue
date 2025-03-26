
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  username: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const initialUser: User = {
  username: '',
  isAuthenticated: false
};

const AuthContext = createContext<AuthContextType>({
  user: initialUser,
  login: async () => false,
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : initialUser;
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Demo credentials check
    if (username === 'rescue' && password === 'team123') {
      setUser({
        username,
        isAuthenticated: true
      });
      toast.success('Login successful');
      return true;
    }
    
    toast.error('Invalid username or password');
    return false;
  };

  const logout = () => {
    setUser(initialUser);
    navigate('/login');
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
