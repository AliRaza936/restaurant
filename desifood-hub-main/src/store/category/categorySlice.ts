import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import categoryService from './categoryService.js'



export let createCategory = createAsyncThunk<any, { name: string }>("category/createCategory",async (inputs,thunkAPI)=>{
  try {
    let response =  await  categoryService.createCat(inputs)  
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
export let getCat = createAsyncThunk<any, void>("category/getCat",async (_,thunkAPI)=>{
  try {
    let response =  await  categoryService.getAllCat()  
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
export let deleteCategory = createAsyncThunk<any, string>("category/deleteCategory",async (id,thunkAPI)=>{
  try {
    let response =  await  categoryService.deleteCat(id)  
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
export let updateCategory = createAsyncThunk<any, { id: string; name: string }>("category/updateCategory",async ({id,name},thunkAPI)=>{
  try {
    let response =  await  categoryService.updateCat({id,name})  
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export let getAllAccProducts = createAsyncThunk("products/getAllAccProducts",async (inputs,thunkAPI)=>{
  try {
    let response =  await  categoryService.getAllAccProd(inputs)  
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
export let getAccCatProduct = createAsyncThunk("products/getAccCatProduct",async (catName,thunkAPI)=>{
  try {
    let response =  await  categoryService.getAccProductWithCatName(catName)  
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export let getSingleProd = createAsyncThunk("products/getSingleProd",async (id,thunkAPI)=>{
  try {
    let response =  await  categoryService.getSingleProduct(id)  
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
export let getAccSingleProd = createAsyncThunk("products/getAccSingleProd",async (id,thunkAPI)=>{
  try {
    let response =  await  categoryService.getSingleAccPorduct(id)  
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
export let featuredProduct = createAsyncThunk("products/featuredProduct",async (input,thunkAPI)=>{
  try {
    let response =  await  categoryService.getFeaturedProducts(input)  
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
export let offerProducts = createAsyncThunk("products/offerProduct",async (input,thunkAPI)=>{
  try {
    let response =  await  categoryService.getOfferProduct(input)  
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})




const initialState = {
  categories:[],
  status : "idel",
  loading:false,
  featuredProducts: [],
  offerProduct:[],
  accProduct:[],
  error : null
}

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.categories = [];
   
      state.status = "idel";
      state.loading = false;
      state.error = null;
    },
    
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
  
  extraReducers: (builder) => {
    builder
  
      // 📦 All Products
      .addCase(createCategory.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = "success";
        state.loading = false;
        // Keep existing categories; UI will refresh via a getCat() call
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCat.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(getCat.fulfilled, (state, action) => {
        state.status = "success";
        state.loading = false;
        // API returns { success, result: Category[] }
        // Normalize state to an array of categories
        // Fallback to empty array if shape is unexpected
        // @ts-expect-error - runtime guards below
        state.categories = (action.payload && (action.payload.result || action.payload.results)) || [];
      })
      .addCase(getCat.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "success";
        state.loading = false;
        // Do not overwrite categories with a message body; UI will refetch
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = "success";
        state.loading = false;
        // Do not overwrite categories with a message body; UI will refetch
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      })
  
      // // 📂 Products by Category
      // .addCase(getCatProduct.pending, (state) => {
      //   state.status = "loading";
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(getCatProduct.fulfilled, (state, action) => {
      //   state.status = "success";
      //   state.loading = false;
      //   state.products = action.payload;
      // })
      // .addCase(getCatProduct.rejected, (state, action) => {
      //   state.status = "failed";
      //   state.loading = false;
      //   state.error = action.payload;
      // })
  
      
  }
})


// Action creators are generated for each case reducer function

export const { resetProducts, incrementByAmount } = categorySlice.actions;

export default categorySlice.reducer




