/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginService from '../services/LoginService';
import constants from '../shared/constants';
import { User } from '../types/User';
import Context from './Context';

const StoreProvider = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    const validatesCurrentUser = async () => {
      try {
        const currentUser = await LoginService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        navigate('/login');
        console.error(err);
      } finally {
        setIsAuthLoading(false);
      }
    };
    validatesCurrentUser();
  }, []);

  /**
   * calls currentUser at each route change
   */
  // const location = useLocation();
  // useEffect(() => {
  //   setIsAuthLoading(true);
  //   console.log('CHAMOU CURRENT USER');
  //   LoginService.validateLogin()
  //     .then(currentUser => {
  //       setUser(currentUser);
  //       console.log(currentUser);
  //       // console.log(currentUser);
  //     })
  //     .catch(() => {
  //       setUser(null);
  //     })
  //     .finally(() => {
  //       setIsAuthLoading(false);
  //       console.log('VOLTOU DO CURRENT USER');
  //     });
  // }, [location]);

  const login = async (email: string, password: string) => {
    await LoginService.login(email, password);
    const currentUser = await LoginService.getCurrentUser();

    if (
      currentUser.roles.some(
        (s: any) =>
          s.name === constants.ROLES.SYSTEM ||
          s.name === constants.ROLES.SALES ||
          s.name === constants.ROLES.TECH ||
          s.name === constants.ROLES.ADMIN,
      )
    ) {
      setUser(currentUser);
      navigate('/');
    } else {
      await LoginService.logOut();
      navigate('/login');

      throw new Error('Invalid email or password');
    }
  };

  const logout = async () => {
    await LoginService.logOut();
    setUser(null);
    navigate('/login');
  };

  return (
    <Context.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isAuthLoading,
        login,
        logout,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default StoreProvider;
