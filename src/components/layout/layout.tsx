import React, { FC } from 'react';

import { Outlet } from 'react-router-dom';
import { AppHeader } from '@components';

export const Layout: FC = () => (
  <>
    <AppHeader />
    <Outlet />
  </>
);
