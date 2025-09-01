import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import productService from './productService.ts'

export let createProduct = createAsyncThunk("product/createProduct", async (formData, thunkAPI) => {
  try {
    let response = await productService.createProduct(formData)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export let getAllProducts = createAsyncThunk("product/getAllProducts", async (_, thunkAPI) => {
  try {
    let response = await productService.getAllProducts()
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export let getSingleProduct = createAsyncThunk("product/getSingleProduct", async (id, thunkAPI) => {
  try {
    let response = await productService.getSingleProduct(id)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export let updateProduct = createAsyncThunk("product/updateProduct", async ({ id, formData }, thunkAPI) => {
  try {
    let response = await productService.updateProduct(id, formData)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export let deleteProduct = createAsyncThunk("product/deleteProduct", async (id, thunkAPI) => {
  try {
    let response = await productService.deleteProduct(id)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

const initialState = {
  products: [],
  singleProduct: null,
  status: "idle",
  loading: false,
  error: null
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.products = [];
      state.singleProduct = null;
      state.status = "idle";
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "success";
        state.loading = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Products
      .addCase(getAllProducts.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.status = "success";
        state.loading = false;
        state.products = action.payload?.result || [];
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      })
      // Get Single Product
      .addCase(getSingleProduct.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.status = "success";
        state.loading = false;
        state.singleProduct = action.payload?.result || null;
      })
      .addCase(getSingleProduct.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "success";
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "success";
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      })
  }
})

export const { resetProducts } = productSlice.actions;
export default productSlice.reducer
