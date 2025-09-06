import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import {
  fetchIngredients,
  getOnLoadFlagsSelector,
  getUserOrders,
  getUserOrdersDataSelector
} from '../../services/shopSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getUserOrdersDataSelector);
  const isUserLoading = useSelector(getOnLoadFlagsSelector).userOders;

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    const tim = setInterval(() => {
      if (!isUserLoading) {
        dispatch(getUserOrders());
      }
    }, 1000);

    return () => {
      clearInterval(tim);
    };
  }, [isUserLoading]);

  return <ProfileOrdersUI orders={orders} />;
};
