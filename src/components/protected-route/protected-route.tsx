import { FC } from 'react';

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { useSelector } from '../../services/store';
import {
  getIsLoginedSelector,
  getOnLoadFlagsSelector
} from '../../services/shopSlice';
import { Preloader } from '@ui';

export const ProtectedRoute: FC = () => {
  const isLogined = useSelector(getIsLoginedSelector);
  const isLoginInProgress = useSelector(getOnLoadFlagsSelector).login;

  if (isLoginInProgress) {
    return <Preloader />;
  }

  if (!isLogined) {
    return <Navigate replace to='/login' />;
  }

  return <Outlet />;
};
