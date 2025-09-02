import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { setCookie } from '../utils/cookie';

import {
  getFeedsApi,
  getIngredientsApi,
  getUserApi,
  loginUserApi,
  registerUserApi,
  TLoginData,
  TRegisterData
} from '@api';

import {
  TIngredient,
  TConstructorIngredient,
  TOrdersData,
  TUser
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
  ordersData: TOrdersData;
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  isOdersDataLoading: boolean;
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
  ingredients: [],
  isIngredientsLoading: true,
  isOdersDataLoading: true,
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

export const registerUserThunk = createAsyncThunk(
  'users/registerUser',
  async (data: TRegisterData) => registerUserApi(data)
);

export const loginUserThunk = createAsyncThunk(
  'users/loginUser',
  async (data: TLoginData) => loginUserApi(data)
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
    },
    makeOrder(state) {
      state.orderRequest = true; // должен вызываться асинхронный метод и этот параметр устанавливаться в экстра редЮсерах
    }
  },
  selectors: {
    getOrdersDataSelector: (state) => state.ordersData,
    getOrderRequestSelector: (state) => state.orderRequest,
    getConstructorItemsSelector: (state) => state.constructorItems,
    getIngredientsSelector: (state) => state.ingredients,
    getIsIngredientsLoadingSelector: (state) => state.isIngredientsLoading,
    getIsOdersDataLoadingSelector: (state) => state.isOdersDataLoading,
    getUserSelector: (state) => state.user
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
      //registerUserThunk
      .addCase(registerUserThunk.pending, (state) => {})
      .addCase(registerUserThunk.rejected, (state) => {})
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.user = action.payload.user;
      })
      //loginUserThunk
      .addCase(loginUserThunk.pending, (state) => {})
      .addCase(loginUserThunk.rejected, (state) => {})
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.user = action.payload.user;
      })
      //getUserThunk
      .addCase(getUserThunk.pending, (state) => {})
      .addCase(getUserThunk.rejected, (state) => {
        state.user = null;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  }
});

export const {
  getIngredientsSelector,
  getIsIngredientsLoadingSelector,
  getOrdersDataSelector,
  getIsOdersDataLoadingSelector,
  getConstructorItemsSelector,
  getOrderRequestSelector,
  getUserSelector
} = shopSlice.selectors;

export const { addIngredient, moveIngredient, deleteIngredient } =
  shopSlice.actions;
export default shopSlice.reducer;
