import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';

import { useSelector } from '../../services/store';
import { getUserOrdersDataSelector } from '../../services/shopSlice';

export const ProfileOrders: FC = () => {
  const orders = useSelector(getUserOrdersDataSelector);
  return <ProfileOrdersUI orders={orders} />;
};
