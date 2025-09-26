import { expect } from '@jest/globals';
import store from './store';
import shopSliceReducer, {  initialState } from './shopSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

describe('Работа rootReducer', () => {
  test('Начальное состояния rootReducer устанавливается верно', () => {
    const { shop } = store.getState();
    expect(initialState).toEqual(shop);
  });

  test('Вызов rootReducer с undefined состоянием и неизвестным экшеном возвращает начальное состояние', () => {
    expect(initialState).toEqual(
      shopSliceReducer(undefined, { type: 'UNKNOWN_ACTION' })
    );
  });
});
