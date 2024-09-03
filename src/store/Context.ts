/*eslint-disable */
import { createContext } from 'react';
import { User } from '../types/User';

export type StoreContextType = {
  isAuthenticated: boolean,
  user: User | null,
  isAuthLoading: boolean,
  login: (email: string, password: string) => Promise<void>,
  logout: () => Promise<void>
}

const StoreContext = createContext<StoreContextType>(null!);

export default StoreContext;
