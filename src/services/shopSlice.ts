import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { deleteCookie, setCookie } from '../utils/cookie';

import {
  getFeedsApi,
  getIngredientsApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
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

type TConstructorItems = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

interface ShopState {
  userOrdersData: TOrder[];
  ordersData: TOrdersData;
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  isOdersDataLoading: boolean;
  isUserOdersLoading: boolean;
  isLoginInProgress: boolean;
  isLogined: boolean;
  constructorItems: TConstructorItems;
  orderRequest: boolean;
  user: TUser | null;
}

const initialState: ShopState = {
  ordersData: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  userOrdersData: [],
  ingredients: [],
  isIngredientsLoading: true,
  isOdersDataLoading: false,
  isUserOdersLoading: false,
  isLoginInProgress: false,
  isLogined: false,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  user: null
};

export const fetchIngredients = createAsyncThunk(
  'shop/getIngredients',
  async () => getIngredientsApi()
);

export const fetchFeeds = createAsyncThunk('shop/getFeeds', async () =>
  getFeedsApi()
);

export const getUserOrders = createAsyncThunk('shop/getUserOrders', async () =>
  getOrdersApi()
);

export const orderBurger = createAsyncThunk(
  'shop/orderBurger',
  async (items: string[]) => orderBurgerApi(items)
);

export const registerUserThunk = createAsyncThunk(
  'users/registerUser',
  async (data: TRegisterData) => registerUserApi(data)
);

export const loginUserThunk = createAsyncThunk(
  'users/loginUser',
  async (data: TLoginData) => loginUserApi(data)
);

export const logoutThunk = createAsyncThunk('users/logout', async () =>
  logoutApi()
);

export const updateUserThunk = createAsyncThunk(
  'users/updateUser',
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

export const getUserThunk = createAsyncThunk('users/getUser', async () =>
  getUserApi()
);

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
    }
  },
  selectors: {
    getUserOrdersDataSelector: (state) => state.userOrdersData,
    getOrdersDataSelector: (state) => state.ordersData,
    getOrderRequestSelector: (state) => state.orderRequest,
    getConstructorItemsSelector: (state) => state.constructorItems,
    getIngredientsSelector: (state) => state.ingredients,
    getIsIngredientsLoadingSelector: (state) => state.isIngredientsLoading,
    getIsOdersDataLoadingSelector: (state) => state.isOdersDataLoading,
    getIsUserOdersLoadingSelector: (state) => state.isUserOdersLoading,
    getUserSelector: (state) => state.user,
    getIsLoginInProgressSelector: (state) => state.isLoginInProgress,
    getIsLoginedSelector: (state) => state.isLogined
  },
  extraReducers: (builder) => {
    builder
      //fetchIngredients
      .addCase(fetchIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.isIngredientsLoading = false;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload;
      })
      //fetchFeeds
      .addCase(fetchFeeds.pending, (state) => {
        state.isOdersDataLoading = true;
      })
      .addCase(fetchFeeds.rejected, (state) => {
        state.isOdersDataLoading = false;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isOdersDataLoading = false;
        state.ordersData = action.payload;
      })
      //getUserOrders
      .addCase(getUserOrders.pending, (state) => {
        state.isUserOdersLoading = true;
      })
      .addCase(getUserOrders.rejected, (state) => {
        state.isUserOdersLoading = false;
        state.isLogined = false;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.userOrdersData = action.payload;
        state.isUserOdersLoading = false;
      })
      //orderBurger
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        console.log('ordered!');
        state.orderRequest = false;
      })
      //registerUserThunk
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoginInProgress = true;
      })
      .addCase(registerUserThunk.rejected, (state) => {
        state.isLogined = false;
        state.isLoginInProgress = false;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.user = action.payload.user;
        state.isLogined = true;
        state.isLoginInProgress = false;
      })
      //loginUserThunk
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoginInProgress = true;
      })
      .addCase(loginUserThunk.rejected, (state) => {
        state.isLogined = false;
        state.isLoginInProgress = false;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.user = action.payload.user;
        state.isLogined = true;
        state.isLoginInProgress = false;
      })
      //updateUserThunk
      .addCase(updateUserThunk.pending, (state) => {})
      .addCase(updateUserThunk.rejected, (state) => {
        state.user = null;
        state.isLogined = false;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLogined = true;
      })
      //getUserThunk
      .addCase(getUserThunk.pending, (state) => {})
      .addCase(getUserThunk.rejected, (state) => {
        state.user = null;
        state.isLogined = false;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLogined = true;
      })
      //logoutThunk
      .addCase(logoutThunk.pending, (state) => {})
      .addCase(logoutThunk.rejected, (state) => {})
      .addCase(logoutThunk.fulfilled, (state, action) => {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
        state.user = null;
        state.isLogined = false;
      });
  }
});

export const {
  getIngredientsSelector,
  getIsIngredientsLoadingSelector,
  getUserOrdersDataSelector,
  getOrdersDataSelector,
  getIsOdersDataLoadingSelector,
  getIsUserOdersLoadingSelector,
  getConstructorItemsSelector,
  getOrderRequestSelector,
  getUserSelector,
  getIsLoginInProgressSelector,
  getIsLoginedSelector
} = shopSlice.selectors;

export const { addIngredient, moveIngredient, deleteIngredient } =
  shopSlice.actions;
export default shopSlice.reducer;
