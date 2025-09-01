import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import orderService from './orderService.js'

export const createOrder = createAsyncThunk('order/createOrder', async (payload, thunkAPI) => {
  try { return await orderService.createOrder(payload) } catch (e) { return thunkAPI.rejectWithValue(e) }
})
export const getAllOrders = createAsyncThunk('order/getAllOrders', async (_, thunkAPI) => {
  try { return await orderService.getAllOrders() } catch (e) { return thunkAPI.rejectWithValue(e) }
})
export const getOrderById = createAsyncThunk('order/getOrderById', async (id, thunkAPI) => {
  try { return await orderService.getOrderById(id) } catch (e) { return thunkAPI.rejectWithValue(e) }
})
export const getUserOrderById = createAsyncThunk('order/getUserOrderById', async (id, thunkAPI) => {
  try { return await orderService.userOrder(id) } catch (e) { return thunkAPI.rejectWithValue(e) }
})
export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async (payload, thunkAPI) => {
    try {
      await orderService.updateOrderStatus(payload);
      return {
        id: payload.id,
        status: payload.status,
      
      };
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const deleteOrder = createAsyncThunk('order/deleteOrder', async (id, thunkAPI) => {
  try { return await orderService.deleteOrder(id) } catch (e) { return thunkAPI.rejectWithValue(e) }
})

const initialState = {
  orders: [],
  single: null,
  loading: false,
  status: 'idle',
  error: null,
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    reset: (state) => { state.orders = []; state.single = null; state.loading = false; state.status = 'idle'; state.error = null }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (s)=>{s.loading=true;s.status='loading'})
      .addCase(createOrder.fulfilled, (s)=>{s.loading=false;s.status='success'})
      .addCase(createOrder.rejected, (s,a)=>{s.loading=false;s.status='failed';s.error=a.payload})

      .addCase(getAllOrders.pending, (s)=>{s.loading=true;s.status='loading'})
      .addCase(getAllOrders.fulfilled, (s,a)=>{s.loading=false;s.status='success';s.orders=a.payload?.result||[]})
      .addCase(getAllOrders.rejected, (s,a)=>{s.loading=false;s.status='failed';s.error=a.payload})

      
      .addCase(getUserOrderById.pending, (s)=>{s.loading=true;s.status='loading'})
      .addCase(getUserOrderById.fulfilled, (s,a)=>{s.loading=false;s.status='success';s.orders=a.payload?.result||[]})
      .addCase(getUserOrderById.rejected, (s,a)=>{s.loading=false;s.status='failed';s.error=a.payload})

      .addCase(getOrderById.pending, (s)=>{s.loading=true;s.status='loading'})
      .addCase(getOrderById.fulfilled, (s,a)=>{s.loading=false;s.status='success';s.single=a.payload?.result||null})
      .addCase(getOrderById.rejected, (s,a)=>{s.loading=false;s.status='failed';s.error=a.payload})

      .addCase(updateOrderStatus.pending, (s)=>{s.loading=true;s.status='loading'})
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
  state.loading = false;
  state.status = "success";

  const { id, status } = action.payload;

  // update the order inside list
  const index = state.orders.findIndex(o => o.id === id);
  if (index !== -1) {
    state.orders[index] = {
      ...state.orders[index],
      status,
    
    };
  }

  // also update single order if currently loaded
  if (state.single && state.single.id === id) {
    state.single = {
      ...state.single,
      status,
   

    };
  }
})

      .addCase(updateOrderStatus.rejected, (s,a)=>{s.loading=false;s.status='failed';s.error=a.payload})

      .addCase(deleteOrder.pending, (s)=>{s.loading=true;s.status='loading'})
      .addCase(deleteOrder.fulfilled, (s)=>{s.loading=false;s.status='success'})
      .addCase(deleteOrder.rejected, (s,a)=>{s.loading=false;s.status='failed';s.error=a.payload})
  }
})

export const { reset } = orderSlice.actions
export default orderSlice.reducer
