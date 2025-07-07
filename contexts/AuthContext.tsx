import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { apiService } from '@/services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  hasOnboarded: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Auth methods
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User) => void;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}
// {
//   id: "DLJSJOIF",
//   name: 'sai',
//   email: 'saicherry93479@gmail.com',
//   phone: "+919515234212",
//   hasOnboarded: false
// }
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(
    null
//     {
//   id: "DLJSJOIF",
//   name: 'sai',
//   email: 'saicherry93479@gmail.com',
//   phone: "+919515234212",
//   hasOnboarded: true
// }
  );
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const [accessToken, userProfile] = await AsyncStorage.multiGet([
        'accessToken',
        'userProfile',
      ]);

      if (accessToken[1] && userProfile[1]) {
        const parsedUser = JSON.parse(userProfile[1]);
        setUser(parsedUser);

        // Validate token with backend
        try {
          await refreshUser();
        } catch (error) {
          console.log('Token validation failed during initialization');
          await clearAuthData();
          setUser(null);
        }
      }
    } catch (error) {
      console.log('Auth initialization error:', error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await apiService.post('/auth/login', {
        email,
        password,
      });

      if (response.success) {
        const { accessToken, refreshToken, user: userData } = response.data;

        // Store tokens and user data
        await AsyncStorage.multiSet([
          ['accessToken', accessToken],
          ['refreshToken', refreshToken],
          ['userProfile', JSON.stringify(userData)],
        ]);

        setUser(userData);

        // Navigate based on onboarding status
        if (!userData.hasOnboarded) {
          router.replace('/onboarding');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await apiService.post('/auth/register', userData);

      if (response.success) {
        const { accessToken, refreshToken, user: newUser } = response.data;

        // Store tokens and user data
        await AsyncStorage.multiSet([
          ['accessToken', accessToken],
          ['refreshToken', refreshToken],
          ['userProfile', JSON.stringify(newUser)],
        ]);

        setUser(newUser);
        router.replace('/onboarding');
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      // Clear local storage
      await clearAuthData();

      // Reset state
      setUser(null);

      // Navigate to auth screen
      router.replace('/(auth)');
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthData = async () => {
    await AsyncStorage.multiRemove([
      'accessToken',
      'refreshToken',
      'userProfile',
    ]);
  };

  const refreshUser = async () => {
    try {
      const response = await apiService.get('/auth/me');
      
      if (response.success) {
        const updatedUser = {
          ...response.data.user,
          hasOnboarded: response.data.user.hasOnboarded,
        };
        
        setUser(updatedUser);
        
        // Update stored user data
        await AsyncStorage.setItem('userProfile', JSON.stringify(updatedUser));

        if (updatedUser.hasOnboarded) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      } else {
        throw new Error('Failed to refresh user data');
      }
    } catch (error: any) {
      console.log('Refresh user error:', error);

      // Clear auth data when refresh fails
      await clearAuthData();
      setUser(null);
      router.replace('/(auth)');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};