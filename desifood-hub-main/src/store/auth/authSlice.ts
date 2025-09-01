import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authService from './authService'

export interface User {
  id: string
  email?: string
  fullName?: string
  is_verified?: boolean
  address?: string
  city?: string
  postal_code?: string
  role?: string
  user_metadata?: {
    full_name?: string
  }
}

interface AuthState {
  user: User | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  loading: boolean
    userData:null,
  error: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  userData:null,
  status: 'idle',
  loading: false,
  
  error: null,
  isAuthenticated: false
}

// Request OTP
export const requestOtp = createAsyncThunk<any, string>(
  "auth/requestOtp",
  async (email, thunkAPI) => {
    try {
      const response = await authService.requestOtp(email)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

// Verify OTP
export const verifyOtp = createAsyncThunk<any, { email: string; code: string }>(
  "auth/verifyOtp",
  async ({ email, code }, thunkAPI) => {
    try {
      const response = await authService.verifyOtp(email, code)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

// Update profile
export const updateProfile = createAsyncThunk<any, { id: string; profileData: any }>(
  "auth/updateProfile",
  async ({ id, profileData }, thunkAPI) => {
    try {
      const response = await authService.updateProfile(id, profileData)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
export const fetchUserById = createAsyncThunk(
  "auth/fetchUserById",
  async (id: string, thunkAPI) => {
    try {
      const user = await authService.getSingleUser(id);
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('user')
    },
    setUser: (state, action) => {
  const { id, role } = action.payload
  const minimalUser = { id, role }

  state.user = minimalUser
  state.isAuthenticated = true
  localStorage.setItem("user", JSON.stringify(minimalUser))
},
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Request OTP
      .addCase(requestOtp.pending, (state) => {
        state.status = "loading"
        state.loading = true
        state.error = null
      })
      .addCase(requestOtp.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.loading = false
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.status = "failed"
        state.loading = false
        state.error = action.payload as string
      })
      
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.status = "loading"
        state.loading = true
        state.error = null
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
  state.status = "succeeded"
  state.loading = false

  if (action.payload?.user) {
    const { id, role } = action.payload.user

    // Save only id & role
    const minimalUser = { id, role }

    state.user = minimalUser
    state.isAuthenticated = true

    // Save minimal user in localStorage
    localStorage.setItem("user", JSON.stringify(minimalUser))
  }
})

      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = "failed"
        state.loading = false
        state.error = action.payload as string
      })
      
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading"
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
  state.status = "succeeded"
  state.loading = false
  
})

      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed"
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(fetchUserById.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.userData = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload as string;
      });
  }
  
})

export const { logout, setUser, clearError } = authSlice.actions

export default authSlice.reducer