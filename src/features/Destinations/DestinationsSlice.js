import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { setLoadingApp } from 'features/commonSlice';
import destinationApi from '../../api/destinationApi';
export const fetchAllDestinations = createAsyncThunk(
  'destinations/fetAllDestinations',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await destinationApi.getAll(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error?.response.data);
    }
  }
);
export const fetchHomestayInDestination = createAsyncThunk(
  'destinations/fetchHomestayInDestination',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await destinationApi.getHomestayInDestination(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error?.response.data);
    }
  }
);
export const addDestination = createAsyncThunk(
  'destinations/addDestination',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      //  host/destinations =  create homestay+ update destination
      const response = await destinationApi.addDestination(payload);
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
export const fetchDestination = createAsyncThunk(
  'destinations/fetchDestination',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      //  host/destinations =  create homestay+ update destination
      const response = await destinationApi.getDestination(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      message.success('Lấy dữ liệu thất bại');
      return rejectWithValue(error?.response.data);
    }
  }
);
export const updateDestination = createAsyncThunk(
  'destinations/updateDestination',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await destinationApi.updateDestination(payload);
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
  destinations: {},
  loading: false,
  error: undefined,
  filters: {},
  destinationDetail: {},
};
const destinationsSlices = createSlice({
  name: 'destinations',
  initialState,
  reducers: {},
  extraReducers: {
    //fetchAllDestinations
    [fetchAllDestinations.fulfilled]: (state, action) => {
      state.destinations = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [fetchAllDestinations.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [fetchAllDestinations.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    //fetch Destination detail
    [fetchDestination.fulfilled]: (state, action) => {
      state.destinationDetail = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [fetchDestination.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [fetchDestination.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    //fetchHomestayInDestination
    [fetchHomestayInDestination.fulfilled]: (state, action) => {
      state.destinationDetail = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [fetchHomestayInDestination.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [fetchHomestayInDestination.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    //addDestination
    [addDestination.fulfilled]: (state, action) => {
      state.error = undefined;
      state.loading = false;
    },
    [addDestination.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [addDestination.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
  },
});
//actions
export const destinationsActions = destinationsSlices.actions;

//selectors

//reducer
const destinationsReducer = destinationsSlices.reducer;
export default destinationsReducer;
