import { expect } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import store from './store';
import shopSliceReducer, {
  fetchFeeds,
  fetchIngredients,
  getOrderByNumber,
  getUserOrders,
  getUserThunk,
  initialState,
  loginUserThunk,
  logoutThunk,
  orderBurger,
  registerUserThunk,
  ShopState,
  updateUserThunk
} from './shopSlice';
import { getCookie } from '../utils/cookie';
import { mockIngredients } from './test-data';

describe('Проверка асинхронных экшенов', () => {
  const rejectedState = Error('Запрос отклонен');

  const compareFields = <T>(state1: T, state2: T, ...exceptions: string[]) => {
    for (const key in state1) {
      if (!exceptions.includes(key)) {
        expect(state1[key]).toEqual(state2[key]);
      }
    }
  }

  describe('fetchIngredients: получение списка ингредиентов', () => {
    let mockStore: typeof store;

    beforeEach(() => {
      mockStore = configureStore({
        reducer: {
          shop: shopSliceReducer
        }
      });
    });

    afterEach(() => {
      // проверить, что состояние, на которое не должен был повлиять экшен, не изменилось
      const shop = mockStore.getState().shop;
      compareFields(initialState, shop, 'onLoad', 'errors', 'ingredients');
      compareFields(initialState.onLoad, shop.onLoad, 'ingredients');
      compareFields(initialState.errors, shop.errors, 'ingredients');
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

    afterEach(() => {
      // проверить, что состояние, на которое не должен был повлиять экшен, не изменилось
      const shop = mockStore.getState().shop;
      compareFields(initialState, shop, 'onLoad', 'errors', 'ordersData');
      compareFields(initialState.onLoad, shop.onLoad, 'odersData');
      compareFields(initialState.errors, shop.errors, 'odersData');
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

    afterEach(() => {
      // проверить, что состояние, на которое не должен был повлиять экшен, не изменилось
      const shop = mockStore.getState().shop;
      compareFields(initialState, shop, 'onLoad', 'errors', 'userOrdersData');
      compareFields(initialState.onLoad, shop.onLoad, 'userOders');
      compareFields(initialState.errors, shop.errors, 'userOders');
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

    afterEach(() => {
      // проверить, что состояние, на которое не должен был повлиять экшен, не изменилось
      const shop = mockStore.getState().shop;
      compareFields(initialState, shop, 'onLoad', 'errors', 'orderByNumberData');
      compareFields(initialState.onLoad, shop.onLoad, 'orderByNumber');
      compareFields(initialState.errors, shop.errors, 'orderByNumber');
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

    afterEach(() => {
      // проверить, что состояние, на которое не должен был повлиять экшен, не изменилось
      const shop = mockStore.getState().shop;
      compareFields(initialState, shop, 'errors', 'userNewOrder');
      compareFields(initialState.errors, shop.errors, 'order');
    });

    it('Экшен orderBurger.pending должен менять переменную загрузки', () => {
      mockStore.dispatch(orderBurger.pending('', mockBurger));
      const isLoading = mockStore.getState().shop.userNewOrder.request;
      expect(isLoading).toBeTruthy();
    });

    it('Экшен orderBurger.fulfilled должен менять переменную загрузки и заказ пользователя', () => {
      mockStore.dispatch(orderBurger.fulfilled(mockResult, '', mockBurger));
      const state = mockStore.getState().shop;
      expect(state.userNewOrder.request).toBeFalsy();
      expect(state.userNewOrder.order).toEqual(mockResult.order);
    });

    it('Экшен orderBurger.rejected должен менять переменную загрузки и записывать ошибку', () => {
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

    afterEach(() => {
      // проверить, что состояние, на которое не должен был повлиять экшен, не изменилось
      const shop = mockStore.getState().shop;
      compareFields(initialState, shop, 'onLoad', 'errors', 'isLogined', 'user');
      compareFields(initialState.onLoad, shop.onLoad, 'login');
      compareFields(initialState.errors, shop.errors, 'login');
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

    afterEach(() => {
      // проверить, что состояние, на которое не должен был повлиять экшен, не изменилось
      const shop = mockStore.getState().shop;
      compareFields(initialState, shop, 'onLoad', 'errors', 'isLogined', 'user');
      compareFields(initialState.onLoad, shop.onLoad, 'login');
      compareFields(initialState.errors, shop.errors, 'login');
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

    afterEach(() => {
      // проверить, что состояние, на которое не должен был повлиять экшен, не изменилось
      const shop = mockStore.getState().shop;
      compareFields(initialState, shop, 'onLoad', 'errors', 'isLogined', 'user');
      compareFields(initialState.onLoad, shop.onLoad, 'logout');
      compareFields(initialState.errors, shop.errors, 'logout');
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

    afterEach(() => {
      // проверить, что состояние, на которое не должен был повлиять экшен, не изменилось
      const shop = mockStore.getState().shop;
      compareFields(initialState, shop, 'onLoad', 'errors', 'user', 'isLogined');
      compareFields(initialState.onLoad, shop.onLoad, 'updateUser');
      compareFields(initialState.errors, shop.errors, 'updateUser');
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

    afterEach(() => {
      // проверить, что состояние, на которое не должен был повлиять экшен, не изменилось
      const shop = mockStore.getState().shop;
      compareFields(initialState, shop, 'onLoad', 'errors', 'user', 'isLogined');
      compareFields(initialState.onLoad, shop.onLoad, 'user');
      compareFields(initialState.errors, shop.errors, 'user');
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
