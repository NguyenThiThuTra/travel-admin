import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { setLoadingApp } from 'features/commonSlice';
import roomApi from '../../api/roomApi';
export const fetchAllRooms = createAsyncThunk(
  'rooms/fetchAllRooms',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await roomApi.getAll(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error?.response.data);
    }
  }
);
export const fetchAllCategory = createAsyncThunk(
  'rooms/fetchAllCategorys',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await roomApi.getAllCategory(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error?.response.data);
    }
  }
);
export const fetchAllCategoryInHomestay = createAsyncThunk(
  'rooms/fetchAllCategoryInHomestay',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await roomApi.getAllCategoryInHomestay(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error?.response.data);
    }
  }
);
export const getRoom = createAsyncThunk(
  'rooms/getRoom',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await roomApi.getRoom(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error?.response.data);
    }
  }
);

export const getCategory = createAsyncThunk(
  'rooms/getCategory',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await roomApi.getCategory(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error?.response.data);
    }
  }
);

export const fetchAllRoomsInMyHomestay = createAsyncThunk(
  'rooms/fetchAllRooms',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await roomApi.getAllRoomsInMyHomestay(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error?.response.data);
    }
  }
);

export const addRoom = createAsyncThunk(
  'rooms/addRoom',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await roomApi.addRoom(payload);
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
export const deleteRoom = createAsyncThunk(
  'rooms/deleteRoom',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await roomApi.deleteRoom(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error?.response.data);
    }
  }
);
export const updateRoom = createAsyncThunk(
  'rooms/updateRoom',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await roomApi.updateRoom(payload);
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
export const updateCategory = createAsyncThunk(
  'rooms/updateCategory',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await roomApi.updateCategory(payload);
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
  category: null,
  categoryUpdated: null,
  rooms: null,
  room: null,
  categoryInHomestay: null,
  loading: false,
  error: undefined,
  filters: {},
  roomRemoved: null,
};
const roomsSlices = createSlice({
  name: 'rooms',
  initialState,
  reducers: {},
  extraReducers: {
    //fetchAll
    [fetchAllRooms.fulfilled]: (state, action) => {
      state.rooms = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [fetchAllRooms.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [fetchAllRooms.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    //fetch category
    [fetchAllCategory.fulfilled]: (state, action) => {
      state.category = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [fetchAllCategory.rejected]: (state, action) => {
      state.category = null;
    },
    //fetch category in homestay
    [fetchAllCategoryInHomestay.fulfilled]: (state, action) => {
      state.categoryInHomestay = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [fetchAllCategoryInHomestay.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [fetchAllCategoryInHomestay.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    //get one
    [getRoom.fulfilled]: (state, action) => {
      state.room = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [getRoom.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getRoom.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    //add one
    [addRoom.fulfilled]: (state, action) => {
      state.error = undefined;
      state.loading = false;
    },
    [addRoom.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [addRoom.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    //delete one
    [deleteRoom.fulfilled]: (state, action) => {
      state.error = undefined;
      state.loading = false;
      state.roomRemoved = action.payload;
    },
    [deleteRoom.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [deleteRoom.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    //update one
    [updateRoom.fulfilled]: (state, action) => {
      state.error = undefined;
      state.loading = false;
    },
    [updateRoom.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [updateRoom.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    //update category
    [updateCategory.fulfilled]: (state, action) => {
      state.categoryUpdated = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [updateCategory.rejected]: (state, action) => {
      state.categoryUpdated = null;
      state.loading = false;
      state.error = action.payload;
    },
    [updateCategory.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
  },
});
//actions
export const roomsActions = roomsSlices.actions;

//selectors
export const useCategorySelector = (state) => state.room.category;
export const useRoomsSelector = (state) => state.room.rooms;
export const useRoomRemovedSelector = (state) => state.room.roomRemoved;
export const useRoomsLoadingSelector = (state) => state.room.loading;
export const useCategoryUpdatedSelector = (state) =>
  state.room.categoryUpdated;

//reducer
const roomsReducer = roomsSlices.reducer;
export default roomsReducer;
