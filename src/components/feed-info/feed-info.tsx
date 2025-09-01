import { useSelector } from '../../services/store';
import { getOrdersDataSelector } from '../../services/shopSlice';
import { FC } from 'react';

import { TOrder, TOrdersData } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const ordersData: TOrdersData = useSelector(getOrdersDataSelector);
  const orders: TOrder[] = ordersData.orders;
  const feed = { total: ordersData.total, totalToday: ordersData.totalToday };

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
