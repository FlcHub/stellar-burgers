import { FC, useEffect } from 'react';

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import {
  getIsLoginedSelector,
  getOnLoadFlagsSelector,
  getPreviousLocationSelector,
  setPreviousPath
} from '../../services/shopSlice';
import { Preloader } from '@ui';

type TT = {
  pathname: string;
};

export const ProtectedRoute: FC<TT> = ({ pathname }) => {
  const dispatch = useDispatch();
  const isLogined = useSelector(getIsLoginedSelector);
  const isLoginInProgress = useSelector(getOnLoadFlagsSelector).login;
  const isUserInProgress = useSelector(getOnLoadFlagsSelector).user;
  const path = useSelector(getPreviousLocationSelector);

  useEffect(() => {
    let prevPath = pathname || '/';
    dispatch(setPreviousPath(prevPath));
  }, [dispatch, path, pathname]);

  if (isLoginInProgress || isUserInProgress) {
    return <Preloader />;
  }

  if (!isLogined) {
    return <Navigate replace to='/login' />;
  }

  return <Outlet />;
};
