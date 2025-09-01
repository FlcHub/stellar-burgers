import { FC, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  getConstructorItemsSelector,
  getOrderRequestSelector
} from '../../services/shopSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  const constructorItems = useSelector(getConstructorItemsSelector);
  const orderRequest = useSelector(getOrderRequestSelector);

  const orderModalData = null;

  const onOrderClick = () => {
    // проверить, залогинен ли пользователь (TODO)
    const user = true;
    if (!user) return; // перенаправить на страницу регистрации

    // если есть булка, то начать оформлять заказ
    if (!constructorItems.bun) return;

    // dispatch(makeOrder());
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
