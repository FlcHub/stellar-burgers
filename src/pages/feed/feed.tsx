import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds, getOrdersDataSelector } from '../../services/shopSlice';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder, TOrdersData } from '@utils-types';
import { FC } from 'react';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const ordersData: TOrdersData = useSelector(getOrdersDataSelector);
  const orders: TOrder[] = ordersData.orders;

  if (!orders.length) {
    return <Preloader />;
  }

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
