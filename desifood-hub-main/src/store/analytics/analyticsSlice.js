import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import analyticsService from './analyticsService.js'

export const getSalesData = createAsyncThunk('analytics/getSalesData', async (period, thunkAPI) => {
  try { return await analyticsService.getSalesData(period) } catch (e) { return thunkAPI.rejectWithValue(e) }
})

export const getDashboardStats = createAsyncThunk('analytics/getDashboardStats', async (_, thunkAPI) => {
  try { return await analyticsService.getDashboardStats() } catch (e) { return thunkAPI.rejectWithValue(e) }
})

export const getTopProducts = createAsyncThunk('analytics/getTopProducts', async (limit, thunkAPI) => {
  try { return await analyticsService.getTopProducts(limit) } catch (e) { return thunkAPI.rejectWithValue(e) }
})

export const getTopCategories = createAsyncThunk('analytics/getTopCategories', async (limit, thunkAPI) => {
  try { return await analyticsService.getTopCategories(limit) } catch (e) { return thunkAPI.rejectWithValue(e) }
})

export const getOrderStats = createAsyncThunk('analytics/getOrderStats', async (_, thunkAPI) => {
  try { return await analyticsService.getOrderStats() } catch (e) { return thunkAPI.rejectWithValue(e) }
})

const initialState = {
  salesData: [],
  dashboardStats: null,
  topProducts: [],
  topCategories: [],
  orderStats: [],
  loading: false,
  status: 'idle',
  error: null,
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    reset: (state) => { 
      state.salesData = []; 
      state.dashboardStats = null; 
      state.topProducts = []; 
      state.topCategories = []; 
      state.orderStats = []; 
      state.loading = false; 
      state.status = 'idle'; 
      state.error = null; 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSalesData.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(getSalesData.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'success';
        state.salesData = action.payload?.result || [];
      })
      .addCase(getSalesData.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'success';
        state.dashboardStats = action.payload?.result || null;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(getTopProducts.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(getTopProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'success';
        state.topProducts = action.payload?.result || [];
      })
      .addCase(getTopProducts.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(getTopCategories.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(getTopCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'success';
        state.topCategories = action.payload?.result || [];
      })
      .addCase(getTopCategories.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(getOrderStats.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(getOrderStats.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'success';
        state.orderStats = action.payload?.result || [];
      })
      .addCase(getOrderStats.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
  }
})

export const { reset } = analyticsSlice.actions
export default analyticsSlice.reducer