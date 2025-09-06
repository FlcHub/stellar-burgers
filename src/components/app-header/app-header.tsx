import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { getUserSelector } from '../../services/shopSlice';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const user = useSelector(getUserSelector);
  return <AppHeaderUI userName={user?.name} />;
};
