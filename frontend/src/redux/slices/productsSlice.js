import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/products`;

// Async Thunk: Fetch Products by Filters
export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async (filters, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await axios.get(`${API_URL}?${query}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async Thunk: Fetch Product Details by ID
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async Thunk: Update Product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, productData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async Thunk: Fetch Similar Products
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/similar/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addProductReview = createAsyncThunk(
  "products/addProductReview",
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/${productId}/reviews`,
        { rating, comment },
        {
          withCredentials: true, // Required for cookies
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// NEW: Async Thunk: Add Product
export const addProduct = createAsyncThunk(
  "products/addProducts",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/create`, productData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  products: [],
  selectedProduct: null,
  similarProducts: [],
  loading: false,
  error: null,
  filters: {
    category: "",
    size: "",
    color: "",
    gender: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "",
    search: "",
    material: "",
    collection: "",
  },
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
  },
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder

      //Fetch products by filter
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        // Make sure action.payload contains properties (products, page, pages, total)
        state.products = Array.isArray(action.payload.products)
          ? action.payload.products
          : [];
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })

      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //handle fetching single product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //handle updating product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;

        const index = state.products.findIndex(
          (product) => product.id === updatedProduct.id
        );

        if (index > -1) {
          state.products[index] = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // handle fetching similar products
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProductReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductReview.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedProduct) {
          // Update reviews array
          state.selectedProduct.reviews = action.payload.reviews;
          // Recalculate review count
          state.selectedProduct.reviewCount = action.payload.reviews.length;
          // Recalculate average rating
          state.selectedProduct.averageRating =
            action.payload.reviews.reduce(
              (acc, review) => acc + review.rating,
              0
            ) / action.payload.reviews.length;
        }
      })
      .addCase(addProductReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // NEW: Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally, add the new product to the products array if needed
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
