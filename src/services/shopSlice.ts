import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { deleteCookie, setCookie } from '../utils/cookie';

import {
  getFeedsApi,
  getIngredientsApi,
  getOrderByNumberApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  updateUserApi
} from '@api';

import {
  TIngredient,
  TConstructorIngredient,
  TOrdersData,
  TUser,
  TOrder
} from '@utils-types';

type TIngredientAction = {
  index: number;
  moveDirection: number;
};

export type TConstructorItems = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

type TNewOrder = {
  order: TOrder | null;
  request: boolean;
};

interface ShopState {
  userNewOrder: TNewOrder;
  userOrdersData: TOrder[];
  orderByNumberData: TOrder[];
  ordersData: TOrdersData;
  ingredients: TIngredient[];
  onLoad: {
    ingredients: boolean;
    odersData: boolean;
    userOders: boolean;
    orderByNumber: boolean;
    user: boolean;
    login: boolean;
    logout: boolean;
    updateUser: boolean;
  };
  errors: {
    ingredients: string | null;
    odersData: string | null;
    userOders: string | null;
    orderByNumber: string | null;
    user: string | null;
    login: string | null;
    logout: string | null;
    order: string | null;
    updateUser: string | null;
  };
  isLogined: boolean;
  constructorItems: TConstructorItems;
  user: TUser | null;
}

export const initialState: ShopState = {
  ordersData: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  userNewOrder: {
    order: null,
    request: false
  },
  userOrdersData: [],
  orderByNumberData: [],
  ingredients: [],
  onLoad: {
    ingredients: true,
    odersData: false,
    userOders: false,
    orderByNumber: true,
    user: true,
    login: false,
    logout: false,
    updateUser: false
  },
  errors: {
    ingredients: null,
    odersData: null,
    userOders: null,
    orderByNumber: null,
    user: null,
    login: null,
    order: null,
    logout: null,
    updateUser: null
  },
  isLogined: false,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  user: null
};

export const fetchIngredients = createAsyncThunk(
  'shop/getIngredients',
  getIngredientsApi
);

export const fetchFeeds = createAsyncThunk('shop/getFeeds', getFeedsApi);

export const getUserOrders = createAsyncThunk(
  'shop/getUserOrders',
  getOrdersApi
);

export const getOrderByNumber = createAsyncThunk(
  'shop/getOrderByNumber',
  getOrderByNumberApi
);

export const orderBurger = createAsyncThunk('shop/orderBurger', orderBurgerApi);

export const registerUserThunk = createAsyncThunk(
  'users/registerUser',
  registerUserApi
);

export const loginUserThunk = createAsyncThunk('users/loginUser', loginUserApi);

export const logoutThunk = createAsyncThunk('users/logout', logoutApi);

export const updateUserThunk = createAsyncThunk(
  'users/updateUser',
  updateUserApi
);

export const getUserThunk = createAsyncThunk('users/getUser', getUserApi);

const swap = (list: TConstructorIngredient[], ind1: number, ind2: number) => {
  const temp = list[ind1];
  list[ind1] = list[ind2];
  list[ind2] = temp;
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    addIngredient(state, action: PayloadAction<TIngredient>) {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.constructorItems.bun = ingredient;
        return;
      }
      const uniqueNumber: number = Date.now();
      state.constructorItems.ingredients.push({
        id: uniqueNumber.toString(),
        ...ingredient
      });
    },
    moveIngredient(state, action: PayloadAction<TIngredientAction>) {
      const items = state.constructorItems.ingredients;
      const { index, moveDirection } = action.payload;
      if (moveDirection < 0 && index > 0) swap(items, index, index - 1);
      if (moveDirection > 0 && index < items.length - 1)
        swap(items, index, index + 1);
    },
    deleteIngredient(state, action: PayloadAction<number>) {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (el, index) => index !== action.payload
        );
    },
    clearOrder(state) {
      state.userNewOrder.request = false;
      state.userNewOrder.order = null;
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    }
  },
  selectors: {
    getUserOrdersDataSelector: (state) => state.userOrdersData,
    getOrdersDataSelector: (state) => state.ordersData,
    getOrderRequestSelector: (state) => state.userNewOrder,
    getConstructorItemsSelector: (state) => state.constructorItems,
    getIngredientsSelector: (state) => state.ingredients,
    getOnLoadFlagsSelector: (state) => state.onLoad,
    getUserSelector: (state) => state.user,
    getIsLoginedSelector: (state) => state.isLogined,
    getOrderByNumberDataSelector: (state) => state.orderByNumberData
  },
  extraReducers: (builder) => {
    builder
      //fetchIngredients
      .addCase(fetchIngredients.pending, (state) => {
        state.onLoad.ingredients = true;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.onLoad.ingredients = false;
        state.errors.ingredients =
          action.error.message ?? 'Не удалось выполнить запрос';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.onLoad.ingredients = false;
        state.ingredients = action.payload;
      })
      //fetchFeeds
      .addCase(fetchFeeds.pending, (state) => {
        state.onLoad.odersData = true;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.onLoad.odersData = false;
        state.errors.odersData =
          action.error.message ?? 'Не удалось выполнить запрос';
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.onLoad.odersData = false;
        state.ordersData = action.payload;
      })
      //getUserOrders
      .addCase(getUserOrders.pending, (state) => {
        state.onLoad.userOders = true;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.onLoad.userOders = false;
        state.isLogined = false;
        state.errors.userOders =
          action.error.message ?? 'Не удалось выполнить запрос';
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.userOrdersData = action.payload;
        state.onLoad.userOders = false;
      })
      //getOrderByNumber
      .addCase(getOrderByNumber.pending, (state) => {
        state.onLoad.orderByNumber = true;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.onLoad.orderByNumber = false;
        state.errors.orderByNumber =
          action.error.message ?? 'Не удалось выполнить запрос';
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderByNumberData = action.payload.orders;
        state.onLoad.orderByNumber = false;
      })
      //orderBurger
      .addCase(orderBurger.pending, (state) => {
        state.userNewOrder.request = true;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.userNewOrder.request = false;
        state.errors.order =
          action.error.message ?? 'Не удалось выполнить запрос';
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.userNewOrder.request = false;
        state.userNewOrder.order = action.payload.order;
      })
      //registerUserThunk
      .addCase(registerUserThunk.pending, (state) => {
        state.onLoad.login = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLogined = false;
        state.onLoad.login = false;
        state.errors.login =
          action.error.message ?? 'Не удалось выполнить запрос';
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.user = action.payload.user;
        state.isLogined = true;
        state.onLoad.login = false;
      })
      //loginUserThunk
      .addCase(loginUserThunk.pending, (state) => {
        state.onLoad.login = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLogined = false;
        state.onLoad.login = false;
        state.errors.login =
          action.error.message ?? 'Не удалось выполнить запрос';
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.user = action.payload.user;
        state.isLogined = true;
        state.onLoad.login = false;
      })
      //updateUserThunk
      .addCase(updateUserThunk.pending, (state) => {
        state.onLoad.updateUser = true;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.user = null;
        state.isLogined = false;
        state.errors.updateUser =
          action.error.message ?? 'Не удалось выполнить запрос';
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLogined = true;
      })
      //getUserThunk
      .addCase(getUserThunk.pending, (state) => {
        state.onLoad.user = true;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.user = null;
        state.onLoad.user = false;
        state.isLogined = false;
        state.errors.user =
          action.error.message ?? 'Не удалось выполнить запрос';
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.onLoad.user = false;
        state.isLogined = true;
      })
      //logoutThunk
      .addCase(logoutThunk.pending, (state) => {
        state.onLoad.logout = true;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.onLoad.logout = false;
        state.errors.logout =
          action.error.message ?? 'Не удалось выполнить запрос';
      })
      .addCase(logoutThunk.fulfilled, (state, action) => {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
        state.user = null;
        state.isLogined = false;
        state.onLoad.logout = false;
      });
  }
});

export const {
  getIngredientsSelector,
  getOnLoadFlagsSelector,
  getUserOrdersDataSelector,
  getOrdersDataSelector,
  getConstructorItemsSelector,
  getOrderRequestSelector,
  getUserSelector,
  getIsLoginedSelector,
  getOrderByNumberDataSelector
} = shopSlice.selectors;

export const { addIngredient, moveIngredient, deleteIngredient, clearOrder } =
  shopSlice.actions;
export default shopSlice.reducer;
