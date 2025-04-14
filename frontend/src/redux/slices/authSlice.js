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

// Async Thunks
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

export const logoutUser = createAsyncThunk(
  "auth/logoutUserAsync",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/logout`,
        {},
        { withCredentials: true }
      );
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    generateNewGuestId: (state) => {
      state.guestId = generateGuestId();
    },
    clearUser: (state) => {
      state.user = null;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
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

      // Register
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
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { generateNewGuestId, clearUser, setUser } = authSlice.actions;
export default authSlice.reducer;
