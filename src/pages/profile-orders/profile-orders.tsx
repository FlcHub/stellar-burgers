import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import {
  getOnLoadFlagsSelector,
  getUserOrders,
  getUserOrdersDataSelector
} from '../../services/shopSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getUserOrdersDataSelector);
  const isUserLoading = useSelector(getOnLoadFlagsSelector).userOders;

  useEffect(() => {
    if (!isUserLoading) {
      dispatch(getUserOrders());
    }
  }, [isUserLoading]);

  return <ProfileOrdersUI orders={orders} />;
};
