import { FC, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  getConstructorItemsSelector,
  getOrderRequestSelector,
  getUserSelector,
  orderBurger
} from '../../services/shopSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const constructorItems = useSelector(getConstructorItemsSelector);
  const orderRequest = useSelector(getOrderRequestSelector);
  const user = useSelector(getUserSelector);

  const orderModalData = null;

  const onOrderClick = () => {
    // проверить, залогинен ли пользователь
    console.log('user', user);
    if (!user) {
      // перенаправить на страницу регистрации
      navigate('/login');
    }

    // если булки нет, то нет и бургера
    if (!constructorItems.bun) return;

    console.log('going to order');
    const items: string[] = [constructorItems.bun._id];
    items.push(...constructorItems.ingredients.map((el) => el._id));
    dispatch(orderBurger(items));
  };
  const closeOrderModal = () => {};

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
