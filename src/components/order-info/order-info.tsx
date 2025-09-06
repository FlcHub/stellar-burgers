import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeeds,
  fetchIngredients,
  getIngredientsSelector,
  getOrdersDataSelector,
  getUserOrders,
  getUserOrdersDataSelector
} from '../../services/shopSlice';
import { useParams } from 'react-router-dom';

const findOrder = (
  recentOrders: TOrder[],
  userOrders: TOrder[],
  orderNumber: number
): TOrder | undefined => {
  let orderData = recentOrders.find((el) => el.number === orderNumber);
  if (!orderData) {
    orderData = userOrders.find((el) => el.number === orderNumber);
  }
  return orderData;
};

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const recentOrders = useSelector(getOrdersDataSelector).orders;
  const userOrders = useSelector(getUserOrdersDataSelector);
  const orderNumber = Number(useParams().number);
  const orderData = findOrder(recentOrders, userOrders, orderNumber);

  const ingredients = useSelector(getIngredientsSelector);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchFeeds());
    dispatch(getUserOrders());
  }, [dispatch]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
