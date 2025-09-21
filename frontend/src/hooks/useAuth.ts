import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (mobileNumber: string, otp: string) => Promise<void>;
  signUp: (mobileNumber: string, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendOTP: (mobileNumber: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('travel_survey_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const sendOTP = async (mobileNumber: string): Promise<void> => {
    // Mock OTP sending - in real app, this would call backend
    console.log(`Sending OTP to ${mobileNumber}`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const signIn = async (mobileNumber: string, otp: string): Promise<void> => {
    // Mock authentication - in real app, this would verify OTP with backend
    if (otp === '123456') {
      const mockUser: User = {
        id: `user_${Date.now()}`,
        mobile_number: mobileNumber,
        role: mobileNumber.startsWith('9999') ? 'scientist' : 'user',
        has_consented: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setUser(mockUser);
      localStorage.setItem('travel_survey_user', JSON.stringify(mockUser));
    } else {
      throw new Error('Invalid OTP');
    }
  };

  const signUp = async (mobileNumber: string, otp: string): Promise<void> => {
    await signIn(mobileNumber, otp);
  };

  const signOut = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem('travel_survey_user');
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    sendOTP,
  };
};