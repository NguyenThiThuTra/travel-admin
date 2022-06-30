import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { setLoadingApp } from 'features/commonSlice';
import homestayApi from '../../api/homestayApi';
export const fetchAllHomestays = createAsyncThunk(
  'homestay/fetchAllHomestays',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await homestayApi.getAll(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error?.response.data);
    }
  }
);
export const fetchAllHomestaySearch = createAsyncThunk(
  'homestay/fetchAllHomestaySearch',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await homestayApi.getAllSearch(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error?.response.data);
    }
  }
);
export const getHomestay = createAsyncThunk(
  'homestay/getHomestay',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await homestayApi.getHomestay(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error?.response.data);
    }
  }
);
export const addHomestay = createAsyncThunk(
  'homestay/addHomestay',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await homestayApi.addHomestay(payload);
      message.success('Thêm thành công');
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      message.success('Thêm thất bại');
      return rejectWithValue(error?.response.data);
    }
  }
);
export const deleteHomestay = createAsyncThunk(
  'homestay/deleteHomestay',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await homestayApi.deleteHomestay(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error?.response.data);
    }
  }
);
export const updateHomestay = createAsyncThunk(
  'homestay/updateHomestay',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await homestayApi.updateHomestay(payload);
      message.success('Cập nhật thành công');
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      message.success('Cập nhật thất bại');
      return rejectWithValue(error?.response.data);
    }
  }
);

export const handleActiveHomestay = createAsyncThunk(
  'homestay/handleActiveHomestay',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await homestayApi.handleActiveHomestay(payload);
      message.success('Cập nhật thành công');
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      message.success('Cập nhật thất bại');
      return rejectWithValue(error?.response.data);
    }
  }
);

const initialState = {
  homestays: null,
  homestay: null,
  loading: false,
  error: undefined,
  filters: {},
  homestayRemoved: null,
};
const homestaysSlices = createSlice({
  name: 'homestays',
  initialState,
  reducers: {},
  extraReducers: {
    //fetchAllHomestays
    [fetchAllHomestays.fulfilled]: (state, action) => {
      state.homestays = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [fetchAllHomestays.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [fetchAllHomestays.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    // fetchAllHomestaySearch
    [fetchAllHomestaySearch.fulfilled]: (state, action) => {
      state.homestays = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [fetchAllHomestaySearch.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [fetchAllHomestaySearch.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    //getHomestay
    [getHomestay.fulfilled]: (state, action) => {
      state.homestay = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [getHomestay.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.homestay = null;
    },
    [getHomestay.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    //addHomestay
    [addHomestay.fulfilled]: (state, action) => {
      state.error = undefined;
      state.loading = false;
    },
    [addHomestay.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [addHomestay.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    //deleteHomestay
    [deleteHomestay.fulfilled]: (state, action) => {
      state.error = undefined;
      state.loading = false;
      state.homestayRemoved = action.payload;
    },
    [deleteHomestay.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.homestayRemoved = null;
    },
    [deleteHomestay.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    //update homestay
    [updateHomestay.fulfilled]: (state, action) => {
      state.error = undefined;
      state.loading = false;
    },
    [updateHomestay.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [updateHomestay.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    [handleActiveHomestay.fulfilled]: (state, action) => {
      state.error = undefined;
      state.loading = false;
      state.homestayUpdated = action.payload;
    },
    [handleActiveHomestay.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.homestayUpdated = null;
    },
  },
});
//actions
export const homestaysActions = homestaysSlices.actions;
export const useStateHomestaySelector = (state) => state.homestay;
export const useHomestaySelector = (state) => state.homestay.homestay;
export const useHomestaysSelector = (state) => state.homestay.homestays;
export const useHomestayRemovedSelector = (state) =>
  state.homestay.homestayRemoved;
export const useHomestayUpdatedSelector = (state) =>
  state.homestay.homestayUpdated;
//selectors

//reducer
const homestaysReducer = homestaysSlices.reducer;
export default homestaysReducer;
