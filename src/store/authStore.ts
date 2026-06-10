import { create } from 'zustand';
import { api } from '../lib';
import toast from 'react-hot-toast';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
  isAuthenticated: !!localStorage.getItem('auth_user'),

  login: async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, name, role, id } = res.data.data;
      const user = { email, name, role, id };
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
      toast.success('Login successful');
      return null;
    } catch (e: any) {
      const msg = e.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
      return msg;
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { token, role, id } = res.data.data;
      const user = { email, name, role, id };
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
      toast.success('Account created successfully');
      return null;
    } catch (e: any) {
      const msg = e.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return msg;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ user: null, isAuthenticated: false });
    toast.success('Logged out');
  },
}));
