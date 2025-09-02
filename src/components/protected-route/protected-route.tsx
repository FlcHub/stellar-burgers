import { FC } from 'react';

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { useSelector } from '../../services/store';
import {
  getUserSelector,
  getIsLoginedSelector,
  getIsLoginInProgressSelector
} from '../../services/shopSlice';
import { Preloader } from '@ui';

export const ProtectedRoute: FC = () => {
  const user = useSelector(getUserSelector);
  const isLogined = useSelector(getIsLoginedSelector);
  const isLoginInProgress = useSelector(getIsLoginInProgressSelector);

  if (isLoginInProgress) {
    return <Preloader />;
  }

  if (!isLogined) {
    return <Navigate replace to='/login' />;
  }

  return <Outlet />;
};
