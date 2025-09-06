import { FC, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  clearUserOrder,
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
  const { request, order } = useSelector(getOrderRequestSelector);
  const user = useSelector(getUserSelector);

  const onOrderClick = () => {
    // проверить, залогинен ли пользователь
    if (!user) {
      // перенаправить на страницу регистрации
      return navigate('/login');
    }

    // нет булки - нет бургера
    if (!constructorItems.bun) return;

    const items: string[] = [constructorItems.bun._id];
    items.push(...constructorItems.ingredients.map((el) => el._id));
    dispatch(orderBurger(items));
  };
  const closeOrderModal = () => {
    dispatch(clearUserOrder());
  };

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
      orderRequest={request}
      constructorItems={constructorItems}
      orderModalData={order}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
