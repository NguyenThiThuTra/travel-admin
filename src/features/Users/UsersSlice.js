import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { setLoadingApp } from 'features/commonSlice';
import userApi from '../../api/userApi';
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await userApi.getAll(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error?.response.data);
    }
  }
);
export const getUser = createAsyncThunk(
  'users/getUser',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await userApi.getUser(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error?.response.data);
    }
  }
);
export const addUser = createAsyncThunk(
  'users/addUser',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await userApi.addUser(payload);
      message.success('Thêm thành công');
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      message.error('Thêm thất bại');
      return rejectWithValue(error?.response.data);
    }
  }
);
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await userApi.updateUser(payload);
      message.success('Cập nhật thành công');
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      message.error(
        error?.response?.data?.error?.message || 'Cập nhật thất bại'
      );
      return rejectWithValue(error?.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await userApi.deleteUser(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error?.response.data);
    }
  }
);
const initialState = {
  users: {},
  user: {},
  loading: false,
  error: undefined,
  filters: {},
  userRemoved: null,
  updateUser: null,
};
const usersSlices = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: {
    //fetchAllUsers
    [fetchAllUsers.fulfilled]: (state, action) => {
      state.users = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [fetchAllUsers.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [fetchAllUsers.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    //getUser
    [getUser.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [getUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getUser.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    //addUser
    [addUser.fulfilled]: (state, action) => {
      state.error = undefined;
      state.loading = false;
    },
    [addUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [addUser.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    //deleteUser
    [deleteUser.fulfilled]: (state, action) => {
      state.error = undefined;
      state.loading = false;
      state.userRemoved = action.payload;
    },
    [deleteUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [deleteUser.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    //update user
    [updateUser.fulfilled]: (state, action) => {
      state.updateUser = action.payload;
      state.error = undefined;
      state.loading = false;
      state.userRemoved = action.payload;
    },
    [updateUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [updateUser.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
  },
});
//actions
export const usersActions = usersSlices.actions;

//selectors

//reducer
const usersReducer = usersSlices.reducer;
export default usersReducer;
