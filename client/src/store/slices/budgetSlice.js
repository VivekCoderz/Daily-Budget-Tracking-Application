import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks
export const fetchDashboardData = createAsyncThunk(
  'budget/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/entries');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to load entries');
    }
  }
);

export const addEntry = createAsyncThunk(
  'budget/addEntry',
  async (entryData, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post('/entries', entryData);
      dispatch(fetchDashboardData());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to add entry');
    }
  }
);

export const deleteEntry = createAsyncThunk(
  'budget/deleteEntry',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.delete(`/entries/${id}`);
      dispatch(fetchDashboardData());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.customMessage || 'Failed to delete entry');
    }
  }
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState: {
    entries: [],
    dailySummary: [],
    stats: {
      totalIncome: 0,
      totalSpend: 0,
      currentBalance: 0,
      averageDailySpend: 0,
      highestSpendDay: null,
      totalSpendDays: 0
    },
    loading: false,
    error: null
  },
  reducers: {
    clearBudgetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Data
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload.entries || [];
        state.dailySummary = action.payload.dailySummary || [];
        state.stats = action.payload.stats || state.stats;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Entry
      .addCase(addEntry.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete Entry
      .addCase(deleteEntry.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearBudgetError } = budgetSlice.actions;
export default budgetSlice.reducer;
