import { FC } from 'react';

import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export const ProtectedRoute: FC = () => <Outlet />;
