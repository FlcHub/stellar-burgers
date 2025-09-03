import { FC } from 'react';

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { useSelector } from '../../services/store';
import {
  getOnLoadFlagsSelector,
  getUserSelector,
  getPreviousLocationSelector
} from '../../services/shopSlice';
import { Preloader } from '@ui';

export const ProtectedFromAuthorizedRoute: FC = () => {
  const user = useSelector(getUserSelector);
  const isLoginInProgress = useSelector(getOnLoadFlagsSelector).login;
  const isUserInProgress = useSelector(getOnLoadFlagsSelector).user;
  const path = useSelector(getPreviousLocationSelector);

  if (isLoginInProgress || isUserInProgress) {
    return <Preloader />;
  }

  if (user) {
    return <Navigate replace to={path || '/'} />;
  }

  return <Outlet />;
};
