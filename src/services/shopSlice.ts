import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { getFeedsApi, getIngredientsApi } from '@api';
import { TIngredient, TConstructorIngredient, TOrdersData } from '@utils-types';

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
  orderRequest: false
};

export const fetchIngredients = createAsyncThunk(
  'shop/getIngredients',
  async () => getIngredientsApi()
);

export const fetchFeeds = createAsyncThunk('shop/getFeeds', async () =>
  getFeedsApi()
);

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
    getIsOdersDataLoadingSelector: (state) => state.isOdersDataLoading
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
      });
  }
});

export const {
  getIngredientsSelector,
  getIsIngredientsLoadingSelector,
  getOrdersDataSelector,
  getIsOdersDataLoadingSelector,
  getConstructorItemsSelector,
  getOrderRequestSelector
} = shopSlice.selectors;

export const { addIngredient, makeOrder } = shopSlice.actions;
export default shopSlice.reducer;
