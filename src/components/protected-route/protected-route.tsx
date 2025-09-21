import { FC, useEffect } from 'react';

import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';
import {
  getIsLoginedSelector,
  getOnLoadFlagsSelector
} from '../../services/shopSlice';
import { Preloader } from '@ui';

type TProps = {
  anonymous: boolean;
};

export const ProtectedRoute: FC<TProps> = ({ anonymous = false }) => {
  const isLogined = useSelector(getIsLoginedSelector);
  const isLoginInProgress = useSelector(getOnLoadFlagsSelector).login;
  const isUserInProgress = useSelector(getOnLoadFlagsSelector).user;

  const location = useLocation();
  const from = location.state?.from || '/';
  // Если разрешен неавторизованный доступ, а пользователь авторизован...
  if (anonymous && isLogined) {
    // ...то отправляем его на предыдущую страницу
    return <Navigate to={from} />;
  }

  // Если требуется авторизация, а пользователь не авторизован...
  if (!anonymous && !isLogined) {
    // ...то отправляем его на страницу логин
    return <Navigate to='/login' state={{ from: location }} />;
  }

  // Чтобы не мелькали страницы Login, Register..., если пользователь авторизован
  if (isLoginInProgress || isUserInProgress) {
    return <Preloader />;
  }

  return <Outlet />;
};
