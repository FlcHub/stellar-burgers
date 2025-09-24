import { expect } from '@jest/globals';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import store from './store';
import shopSliceReducer, {
  addIngredient,
  deleteIngredient,
  fetchFeeds,
  fetchIngredients,
  getOrderByNumber,
  getUserOrders,
  getUserThunk,
  initialState,
  loginUserThunk,
  logoutThunk,
  moveIngredient,
  orderBurger,
  registerUserThunk,
  updateUserThunk
} from './shopSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { getCookie } from '../utils/cookie';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa093d',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0945',
    name: 'Соус с шипами Антарианского плоскоходца',
    type: 'sauce',
    proteins: 101,
    fat: 99,
    carbohydrates: 100,
    calories: 100,
    price: 88,
    image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
  }
];

const ingredientsBefore: TConstructorIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa0941',
    id: '0',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0945',
    id: '0',
    name: 'Соус с шипами Антарианского плоскоходца',
    type: 'sauce',
    proteins: 101,
    fat: 99,
    carbohydrates: 100,
    calories: 100,
    price: 88,
    image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0944',
    id: '0',
    name: 'Соус традиционный галактический',
    type: 'sauce',
    proteins: 42,
    fat: 24,
    carbohydrates: 42,
    calories: 99,
    price: 15,
    image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
  }
];

const ingredientsAfterDelete: TConstructorIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa0941',
    id: '0',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0944',
    id: '0',
    name: 'Соус традиционный галактический',
    type: 'sauce',
    proteins: 42,
    fat: 24,
    carbohydrates: 42,
    calories: 99,
    price: 15,
    image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
  }
];

const ingredientsMovedAfterUp: TConstructorIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa0945',
    id: '0',
    name: 'Соус с шипами Антарианского плоскоходца',
    type: 'sauce',
    proteins: 101,
    fat: 99,
    carbohydrates: 100,
    calories: 100,
    price: 88,
    image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    id: '0',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0944',
    id: '0',
    name: 'Соус традиционный галактический',
    type: 'sauce',
    proteins: 42,
    fat: 24,
    carbohydrates: 42,
    calories: 99,
    price: 15,
    image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
  }
];

const ingredientsMovedAfterDn: TConstructorIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa0941',
    id: '0',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0944',
    id: '0',
    name: 'Соус традиционный галактический',
    type: 'sauce',
    proteins: 42,
    fat: 24,
    carbohydrates: 42,
    calories: 99,
    price: 15,
    image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0945',
    id: '0',
    name: 'Соус с шипами Антарианского плоскоходца',
    type: 'sauce',
    proteins: 101,
    fat: 99,
    carbohydrates: 100,
    calories: 100,
    price: 88,
    image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
  }
];

const bunIngredientOne = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const bunIngredientTwo = {
  _id: '643d69a5c3f7b9001cfa093d',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
};

const fillIngredient = {
  _id: '643d69a5c3f7b9001cfa0945',
  name: 'Соус с шипами Антарианского плоскоходца',
  type: 'sauce',
  proteins: 101,
  fat: 99,
  carbohydrates: 100,
  calories: 100,
  price: 88,
  image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
};

const burgerConstructorWithBun = {
  bun: { ...bunIngredientOne },
  ingredients: []
};

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

describe('Работа редьюсера конструктора бургера', () => {
  test('Добавление булки в конструктор бургера', () => {
    const { ingredients: _, ...restState } = initialState;
    const initialIngredientsState = {
      ingredients: mockIngredients,
      ...restState
    };

    // Добавить булочку
    const newState = shopSliceReducer(
      initialIngredientsState,
      addIngredient(bunIngredientOne)
    );

    // Получить конструктор из нового состояния
    const { constructorItems } = newState;

    // Сравнить результат с ожидаемым значением
    expect(burgerConstructorWithBun).toEqual(constructorItems);
  });

  test('Добавление новой булки в конструктор бургера подменяет предыдущую булку', () => {
    const { ingredients: _, ...restState } = initialState;
    const initialIngredientsState = {
      ingredients: mockIngredients,
      ...restState
    };

    // Добавить булочку
    const newState = shopSliceReducer(
      initialIngredientsState,
      addIngredient(bunIngredientOne)
    );

    // Получить конструктор из нового состояния
    const { constructorItems } = newState;

    // Сравнить результат с ожидаемым значением
    expect(burgerConstructorWithBun).toEqual(constructorItems);

    // Заменить булочку
    const secondState = shopSliceReducer(
      newState,
      addIngredient(bunIngredientTwo)
    );

    const BurgerConstructorWithBunTwo = {
      bun: { ...bunIngredientTwo },
      ingredients: []
    };

    expect(BurgerConstructorWithBunTwo).toEqual(secondState.constructorItems);
  });

  test('Добавление ингредиента в конструктор бургера', () => {
    const { ingredients: _, ...restState } = initialState;
    const initialIngredientsState = {
      ingredients: mockIngredients,
      ...restState
    };

    // Добавить булочку
    const newState = shopSliceReducer(
      initialIngredientsState,
      addIngredient(fillIngredient)
    );

    // Получить конструктор из нового состояния
    const { constructorItems } = newState;

    // Ожидаемы результат содержит fillIngredient и неважно какой id
    const burgerConstructorWithFill = {
      bun: null,
      ingredients: [{ id: expect.any(String), ...fillIngredient }]
    };

    // Сравнить результат с ожидаемым значением
    expect(burgerConstructorWithFill).toEqual(constructorItems);
  });

  test('Удаление ингредиента из конструктора бургера', () => {
    const { constructorItems: _, ...restState } = initialState;
    const initialIngredientsState = {
      constructorItems: {
        bun: null,
        ingredients: ingredientsBefore
      },
      ...restState
    };

    // Удалить второй ингредиент
    const newState = shopSliceReducer(
      initialIngredientsState,
      deleteIngredient(1)
    );
    const { constructorItems } = newState;
    expect(ingredientsAfterDelete).toEqual(constructorItems.ingredients);
  });

  test('Перемещение самого вверхнего ингредиента вверх не меняет состояния конструктора', () => {
    const { constructorItems: _, ...restState } = initialState;
    const initialIngredientsState = {
      constructorItems: {
        bun: null,
        ingredients: ingredientsBefore
      },
      ...restState
    };

    // Переместить верхний ингредиент вверх
    const newState = shopSliceReducer(
      initialIngredientsState,
      moveIngredient({ index: 0, moveDirection: -1 })
    );
    const { constructorItems } = newState;
    expect(ingredientsBefore).toEqual(constructorItems.ingredients);
  });

  test('Перемещение самого нижнего ингредиента вниз не меняет состояния конструктора', () => {
    const { constructorItems: _, ...restState } = initialState;
    const initialIngredientsState = {
      constructorItems: {
        bun: null,
        ingredients: ingredientsBefore
      },
      ...restState
    };

    // Переместить нижний ингредиент вниз
    const newState = shopSliceReducer(
      initialIngredientsState,
      moveIngredient({ index: ingredientsBefore.length - 1, moveDirection: 1 })
    );
    const { constructorItems } = newState;
    expect(ingredientsBefore).toEqual(constructorItems.ingredients);
  });

  test('Перемещение не крайнего ингредиента вверх по списку в конструкторе', () => {
    const { constructorItems: _, ...restState } = initialState;
    const initialIngredientsState = {
      constructorItems: {
        bun: null,
        ingredients: ingredientsBefore
      },
      ...restState
    };

    // Переместить второй ингредиент вверх
    const newState = shopSliceReducer(
      initialIngredientsState,
      moveIngredient({ index: 1, moveDirection: -1 })
    );
    const { constructorItems } = newState;
    expect(ingredientsMovedAfterUp).toEqual(constructorItems.ingredients);
  });

  test('Перемещение не крайнего ингредиента вниз по списку в конструкторе', () => {
    const { constructorItems: _, ...restState } = initialState;
    const initialIngredientsState = {
      constructorItems: {
        bun: null,
        ingredients: ingredientsBefore
      },
      ...restState
    };

    // Переместить второй ингредиент вниз
    const newState = shopSliceReducer(
      initialIngredientsState,
      moveIngredient({ index: 1, moveDirection: 1 })
    );
    const { constructorItems } = newState;
    expect(ingredientsMovedAfterDn).toEqual(constructorItems.ingredients);
  });
});

describe('Проверка асинхронных экшенов', () => {
  const rejectedState = Error('Запрос отклонен');

  describe('fetchIngredients: получение списка ингредиентов', () => {
    let mockStore: typeof store;

    beforeEach(() => {
      mockStore = configureStore({
        reducer: {
          shop: shopSliceReducer
        }
      });
    });

    test('Запрос списка ингредиентов', async () => {
      // Мокируем глобальную функцию fetch
      const spy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockIngredients })
      } as Response);

      await mockStore.dispatch(fetchIngredients());

      // функция fetch вызвалась
      expect(spy).toHaveBeenCalledTimes(1);

      const store = mockStore.getState().shop;

      // данные получены и записаны в store
      expect(store.ingredients).toEqual(mockIngredients);
      expect(store.onLoad.ingredients).toBeFalsy();

      // restore the spy created with spyOn
      jest.restoreAllMocks();
    });

    it('Экшен fetchIngredients.pending должен менять переменную загрузки', () => {
      mockStore.dispatch(fetchIngredients.pending(''));
      const isLoading = mockStore.getState().shop.onLoad.ingredients;
      expect(isLoading).toBeTruthy();
    });

    it('Экшен fetchIngredients.fulfilled должен менять переменную загрузки и таблицу ингредиентов', () => {
      mockStore.dispatch(fetchIngredients.fulfilled(mockIngredients, ''));
      const state = mockStore.getState().shop;
      expect(state.onLoad.ingredients).toBeFalsy();
      expect(state.ingredients).toEqual(mockIngredients);
    });

    it('Экшен fetchIngredients.rejected должен менять переменную загрузки и записывать ошибку', () => {
      mockStore.dispatch(fetchIngredients.rejected(rejectedState, ''));
      const state = mockStore.getState().shop;
      expect(state.onLoad.ingredients).toBeFalsy();
      expect(state.errors.ingredients).toEqual(rejectedState.message);
    });
  });

  describe('fetchFeeds: получение списка заказов', () => {
    let mockStore: typeof store;

    const mockOrders = {
      success: true,
      orders: [
        {
          _id: '68d2704d673086001ba8958e',
          ingredients: [
            '643d69a5c3f7b9001cfa093c',
            '643d69a5c3f7b9001cfa093e',
            '643d69a5c3f7b9001cfa0943',
            '643d69a5c3f7b9001cfa093c'
          ],
          status: 'done',
          name: 'Краторный space люминесцентный бургер',
          createdAt: '2025-09-23T10:02:53.479Z',
          updatedAt: '2025-09-23T10:02:55.279Z',
          number: 89214
        },
        {
          _id: '68d2704b673086001ba8958d',
          ingredients: [
            '643d69a5c3f7b9001cfa093c',
            '643d69a5c3f7b9001cfa093e',
            '643d69a5c3f7b9001cfa0943',
            '643d69a5c3f7b9001cfa093c'
          ],
          status: 'done',
          name: 'Краторный space люминесцентный бургер',
          createdAt: '2025-09-23T10:02:51.047Z',
          updatedAt: '2025-09-23T10:02:53.116Z',
          number: 89213
        }
      ],
      total: 88888,
      totalToday: 76
    };

    beforeEach(() => {
      mockStore = configureStore({
        reducer: {
          shop: shopSliceReducer
        }
      });
    });

    test('Запрос списка заказов', async () => {
      // Мокируем глобальную функцию fetch
      const spy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOrders)
      } as Response);

      await mockStore.dispatch(fetchFeeds());

      // функция fetch вызвалась
      expect(spy).toHaveBeenCalledTimes(1);

      const store = mockStore.getState().shop;

      // данные получены и записаны в store
      expect(store.ordersData).toEqual(mockOrders);
      expect(store.onLoad.odersData).toBeFalsy();

      // restore the spy created with spyOn
      jest.restoreAllMocks();
    });

    it('Экшен fetchFeeds.pending должен менять переменную загрузки', () => {
      mockStore.dispatch(fetchFeeds.pending(''));
      const isLoading = mockStore.getState().shop.onLoad.odersData;
      expect(isLoading).toBeTruthy();
    });

    it('Экшен fetchFeeds.fulfilled должен менять переменную загрузки и таблицу заказов', () => {
      mockStore.dispatch(fetchFeeds.fulfilled(mockOrders, ''));
      const state = mockStore.getState().shop;
      expect(state.onLoad.odersData).toBeFalsy();
      expect(state.ordersData).toEqual(mockOrders);
    });

    it('Экшен fetchFeeds.rejected должен менять переменную загрузки и записывать ошибку', () => {
      mockStore.dispatch(fetchFeeds.rejected(rejectedState, ''));
      const state = mockStore.getState().shop;
      expect(state.onLoad.odersData).toBeFalsy();
      expect(state.errors.odersData).toEqual(rejectedState.message);
    });
  });

  describe('getUserOrders: получение списка заказов пользоваеля', () => {
    let mockStore: typeof store;

    const mockOrders = [
      {
        _id: '68bee2d2673086001ba87319',
        ingredients: [
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa093f',
          '643d69a5c3f7b9001cfa0947',
          '643d69a5c3f7b9001cfa0946'
        ],
        status: 'done',
        name: 'Флюоресцентный минеральный фалленианский бессмертный бургер',
        createdAt: '2025-09-08T14:06:10.413Z',
        updatedAt: '2025-09-08T14:06:11.363Z',
        number: 88181
      }
    ];

    beforeEach(() => {
      mockStore = configureStore({
        reducer: {
          shop: shopSliceReducer
        }
      });
    });

    it('Экшен getUserOrders.pending должен менять переменную загрузки', () => {
      mockStore.dispatch(getUserOrders.pending(''));
      const isLoading = mockStore.getState().shop.onLoad.userOders;
      expect(isLoading).toBeTruthy();
    });

    it('Экшен getUserOrders.fulfilled должен менять переменную загрузки и таблицу заказов пользователя', () => {
      mockStore.dispatch(getUserOrders.fulfilled(mockOrders, ''));
      const state = mockStore.getState().shop;
      expect(state.onLoad.odersData).toBeFalsy();
      expect(state.userOrdersData).toEqual(mockOrders);
    });

    it('Экшен getUserOrders.rejected должен менять переменную загрузки и записывать ошибку', () => {
      mockStore.dispatch(getUserOrders.rejected(rejectedState, ''));
      const state = mockStore.getState().shop;
      expect(state.onLoad.userOders).toBeFalsy();
      expect(state.errors.userOders).toEqual(rejectedState.message);
    });
  });

  describe('getOrderByNumber: получение заказа по его номеру', () => {
    let mockStore: typeof store;

    const mockOrder = {
      success: true,
      orders: [
        {
          _id: '68d2c27e673086001ba896c7',
          ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa093c'],
          owner: '68d01b9b673086001ba89204',
          status: 'done',
          name: 'Краторный бургер',
          createdAt: '2025-09-23T15:53:34.357Z',
          updatedAt: '2025-09-23T15:53:35.547Z',
          number: 89269
        }
      ]
    };

    beforeEach(() => {
      mockStore = configureStore({
        reducer: {
          shop: shopSliceReducer
        }
      });
    });

    it('Экшен getOrderByNumber.pending должен менять переменную загрузки', () => {
      mockStore.dispatch(getOrderByNumber.pending('', 89269));
      const isLoading = mockStore.getState().shop.onLoad.orderByNumber;
      expect(isLoading).toBeTruthy();
    });

    it('Экшен getOrderByNumber.fulfilled должен менять переменную загрузки и таблицу заказа', () => {
      mockStore.dispatch(getOrderByNumber.fulfilled(mockOrder, '', 89269));
      const state = mockStore.getState().shop;
      expect(state.onLoad.orderByNumber).toBeFalsy();
      expect(state.orderByNumberData).toEqual(mockOrder.orders);
    });

    it('Экшен getOrderByNumber.rejected должен менять переменную загрузки и записывать ошибку', () => {
      mockStore.dispatch(getOrderByNumber.rejected(rejectedState, '', 89269));
      const state = mockStore.getState().shop;
      expect(state.onLoad.orderByNumber).toBeFalsy();
      expect(state.errors.orderByNumber).toEqual(rejectedState.message);
    });
  });

  describe('orderBurger: заказ бургера', () => {
    let mockStore: typeof store;

    const mockBurger = ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa0941'];

    const mockResult = {
      success: true,
      name: 'Просто Бургер',
      order: {
        _id: '',
        status: '',
        name: '',
        createdAt: '',
        updatedAt: '',
        number: 0,
        ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa0941']
      }
    };

    beforeEach(() => {
      mockStore = configureStore({
        reducer: {
          shop: shopSliceReducer
        }
      });
    });

    it('Экшен orderBurger.pending должен менять переменную загрузки', () => {
      mockStore.dispatch(orderBurger.pending('', mockBurger));
      const isLoading = mockStore.getState().shop.userNewOrder.request;
      expect(isLoading).toBeTruthy();
    });

    it('Экшен getOrderByNumber.fulfilled должен менять переменную загрузки и заказ пользователя', () => {
      mockStore.dispatch(orderBurger.fulfilled(mockResult, '', mockBurger));
      const state = mockStore.getState().shop;
      expect(state.userNewOrder.request).toBeFalsy();
      expect(state.userNewOrder.order).toEqual(mockResult.order);
    });

    it('Экшен getOrderByNumber.rejected должен менять переменную загрузки и записывать ошибку', () => {
      mockStore.dispatch(orderBurger.rejected(rejectedState, '', mockBurger));
      const state = mockStore.getState().shop;
      expect(state.userNewOrder.request).toBeFalsy();
      expect(state.errors.order).toEqual(rejectedState.message);
    });
  });

  describe('registerUserThunk: регистрация пользователя', () => {
    let mockStore: typeof store;

    const mockUser = {
      email: 'email@email.ru',
      name: 'Name',
      password: 'pass-word'
    };

    const mockResult = {
      success: true,
      refreshToken: 'rTokenrTokenrToken',
      accessToken: 'aTokenaTokenaToken',
      user: {
        email: mockUser.email,
        name: mockUser.name
      }
    };

    beforeEach(() => {
      mockStore = configureStore({
        reducer: {
          shop: shopSliceReducer
        }
      });
    });

    it('Экшен registerUserThunk.pending должен менять переменную загрузки', () => {
      mockStore.dispatch(registerUserThunk.pending('', mockUser));
      const isLoading = mockStore.getState().shop.onLoad.login;
      expect(isLoading).toBeTruthy();
    });

    it('Экшен registerUserThunk.fulfilled должен менять переменную загрузки и данные пользователя', () => {
      mockStore.dispatch(registerUserThunk.fulfilled(mockResult, '', mockUser));
      const state = mockStore.getState().shop;

      // проверить состояние хранилища
      expect(state.onLoad.login).toBeFalsy();
      expect(state.isLogined).toBeTruthy();
      expect(state.user).toEqual(mockResult.user);

      // проверить cookies:
      expect(getCookie('accessToken')).toEqual(mockResult.accessToken);

      // проверить localStorage:
      expect(localStorage.getItem('refreshToken')).toEqual(
        mockResult.refreshToken
      );
    });

    it('Экшен registerUserThunk.rejected должен менять переменную загрузки и записывать ошибку', () => {
      mockStore.dispatch(
        registerUserThunk.rejected(rejectedState, '', mockUser)
      );
      const state = mockStore.getState().shop;
      expect(state.onLoad.login).toBeFalsy();
      expect(state.isLogined).toBeFalsy();
      expect(state.errors.login).toEqual(rejectedState.message);
    });
  });

  describe('loginUserThunk: вход пользователя на сайт', () => {
    let mockStore: typeof store;

    const mockUser = {
      email: 'email@email.ru',
      password: 'pass-word'
    };

    const mockResult = {
      success: true,
      refreshToken: 'rTokenrTokenrToken',
      accessToken: 'aTokenaTokenaToken',
      user: {
        email: mockUser.email,
        name: 'Some Name'
      }
    };

    beforeEach(() => {
      mockStore = configureStore({
        reducer: {
          shop: shopSliceReducer
        }
      });
    });

    it('Экшен loginUserThunk.pending должен менять переменную загрузки', () => {
      mockStore.dispatch(loginUserThunk.pending('', mockUser));
      const isLoading = mockStore.getState().shop.onLoad.login;
      expect(isLoading).toBeTruthy();
    });

    it('Экшен loginUserThunk.fulfilled должен менять переменную загрузки и данные пользователя', () => {
      mockStore.dispatch(loginUserThunk.fulfilled(mockResult, '', mockUser));
      const state = mockStore.getState().shop;

      // проверить состояние хранилища
      expect(state.onLoad.login).toBeFalsy();
      expect(state.isLogined).toBeTruthy();
      expect(state.user).toEqual(mockResult.user);

      // проверить cookies:
      expect(getCookie('accessToken')).toEqual(mockResult.accessToken);

      // проверить localStorage:
      expect(localStorage.getItem('refreshToken')).toEqual(
        mockResult.refreshToken
      );
    });

    it('Экшен loginUserThunk.rejected должен менять переменную загрузки и записывать ошибку', () => {
      mockStore.dispatch(loginUserThunk.rejected(rejectedState, '', mockUser));
      const state = mockStore.getState().shop;
      expect(state.onLoad.login).toBeFalsy();
      expect(state.isLogined).toBeFalsy();
      expect(state.errors.login).toEqual(rejectedState.message);
    });
  });

  describe('logoutThunk: выход пользователя с сайта', () => {
    let mockStore: typeof store;

    const mockResult = {
      success: true,
      user: null
    };

    beforeEach(() => {
      mockStore = configureStore({
        reducer: {
          shop: shopSliceReducer
        }
      });
    });

    it('Экшен logoutThunk.pending должен менять переменную загрузки', () => {
      mockStore.dispatch(logoutThunk.pending(''));
      const isLoading = mockStore.getState().shop.onLoad.logout;
      expect(isLoading).toBeTruthy();
    });

    it('Экшен logoutThunk.fulfilled должен менять переменную загрузки и данные пользователя', () => {
      mockStore.dispatch(logoutThunk.fulfilled(mockResult, ''));
      const state = mockStore.getState().shop;

      // проверить состояние хранилища
      expect(state.onLoad.logout).toBeFalsy();
      expect(state.isLogined).toBeFalsy();
      expect(state.user).toEqual(mockResult.user);

      // проверить cookies:
      expect(getCookie('accessToken')).toEqual(undefined);

      // проверить localStorage:
      expect(localStorage.getItem('refreshToken')).toEqual(null);
    });

    it('Экшен logoutThunk.rejected должен менять переменную загрузки и записывать ошибку', () => {
      mockStore.dispatch(logoutThunk.rejected(rejectedState, ''));
      const state = mockStore.getState().shop;
      expect(state.onLoad.logout).toBeFalsy();
      expect(state.errors.logout).toEqual(rejectedState.message);
    });
  });

  describe('updateUserThunk: обновить данные пользователя', () => {
    let mockStore: typeof store;

    const mockUser = {
      email: 'email@email.ru',
      name: 'Name',
      password: 'pass-word'
    };

    const mockResult = {
      success: true,
      user: {
        email: mockUser.email,
        name: mockUser.name
      }
    };

    beforeEach(() => {
      mockStore = configureStore({
        reducer: {
          shop: shopSliceReducer
        }
      });
    });

    it('Экшен updateUserThunk.pending должен менять переменную загрузки', () => {
      mockStore.dispatch(updateUserThunk.pending('', mockUser));
      const isLoading = mockStore.getState().shop.onLoad.updateUser;
      expect(isLoading).toBeTruthy();
    });

    it('Экшен updateUserThunk.fulfilled должен менять переменную загрузки и данные пользователя', () => {
      mockStore.dispatch(updateUserThunk.fulfilled(mockResult, '', mockUser));
      const state = mockStore.getState().shop;
      expect(state.onLoad.updateUser).toBeFalsy();
      expect(state.user).toEqual(mockResult.user);
    });

    it('Экшен updateUserThunk.rejected должен менять переменную загрузки и записывать ошибку', () => {
      mockStore.dispatch(updateUserThunk.rejected(rejectedState, '', mockUser));
      const state = mockStore.getState().shop;
      expect(state.onLoad.updateUser).toBeFalsy();
      expect(state.errors.updateUser).toEqual(rejectedState.message);
    });
  });

  describe('getUserThunk: получить данные пользователя', () => {
    let mockStore: typeof store;

    const mockResult = {
      success: true,
      user: {
        email: 'nickname@email.ru',
        name: 'Some Name'
      }
    };

    beforeEach(() => {
      mockStore = configureStore({
        reducer: {
          shop: shopSliceReducer
        }
      });
    });

    it('Экшен getUserThunk.pending должен менять переменную загрузки', () => {
      mockStore.dispatch(getUserThunk.pending(''));
      const isLoading = mockStore.getState().shop.onLoad.user;
      expect(isLoading).toBeTruthy();
    });

    it('Экшен getUserThunk.fulfilled должен менять переменную загрузки и данные пользователя', () => {
      mockStore.dispatch(getUserThunk.fulfilled(mockResult, ''));
      const state = mockStore.getState().shop;
      expect(state.onLoad.user).toBeFalsy();
      expect(state.user).toEqual(mockResult.user);
    });

    it('Экшен getUserThunk.rejected должен менять переменную загрузки и записывать ошибку', () => {
      mockStore.dispatch(getUserThunk.rejected(rejectedState, ''));
      const state = mockStore.getState().shop;
      expect(state.onLoad.user).toBeFalsy();
      expect(state.errors.user).toEqual(rejectedState.message);
    });
  });
});
