import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeeds,
  fetchIngredients,
  getOnLoadFlagsSelector,
  getOrdersDataSelector
} from '../../services/shopSlice';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder, TOrdersData } from '@utils-types';
import { FC, useEffect } from 'react';

export const Feed: FC = () => {
  const isOrdersLoading = useSelector(getOnLoadFlagsSelector).odersData;
  const dispatch = useDispatch();

  const ordersData: TOrdersData = useSelector(getOrdersDataSelector);
  const orders: TOrder[] = ordersData.orders;

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    const tim = setInterval(() => {
      if (!isOrdersLoading) {
        dispatch(fetchFeeds());
      }
    }, 1000);

    return () => {
      console.log('clear');
      clearInterval(tim);
    };
  }, [isOrdersLoading]);

  if (!orders.length) {
    return <Preloader />;
  }

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
