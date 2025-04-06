import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Generate Guest ID (Stored in Memory)
const generateGuestId = () => `guest_${Date.now()}`;

// Initial State
const initialState = {
  user: null,
  guestId: generateGuestId(), // Guest ID resets on refresh
  loading: false,
  error: null,
};

// Async Thunk for User Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        userData,
        { withCredentials: true }
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// Async Thunk for User Registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        userData,
        { withCredentials: true }
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    generateNewGuestId: (state) => {
      state.guestId = generateGuestId();
    },
    logoutUser: (state) => {
      state.user = null;
      state.error = null;
    },
    // New action to update the state with the rehydrated user
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register Cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { generateNewGuestId, logoutUser, setUser } = authSlice.actions;
export default authSlice.reducer;
