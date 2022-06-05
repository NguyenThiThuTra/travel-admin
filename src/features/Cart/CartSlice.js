import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import userApi from '../../api/userApi';
import authApi from '../../api/authApi';
import { message, notification } from 'antd';
import jwt_decode from 'jwt-decode';

export const login = createAsyncThunk(
  'card/login',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authApi.login(payload);
      localStorage.setItem('access_token', response.token);
      notification.success({
        message: 'Đăng nhập thành công !',
        duration: 1.5,
        style: { backgroundColor: '#d4edda' },
      });
      return response;
    } catch (error) {
      notification.error({
        message: 'Đăng nhập thất bại !',

        duration: 1.5,
        style: { backgroundColor: '#f8d7da' },
      });
      return rejectWithValue(error?.response.data);
    }
  }
);

const initialState = {
  currentUser: null,
  loading: false,
  error: undefined,
};
const cardSlices = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      localStorage.removeItem('access_token');
      state.loading = false;
      state.currentUser = undefined;
      state.error = undefined;
    },
  },
  extraReducers: {
    //login
    [login.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.currentUser = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [login.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.loading = false;
      state.error = action.payload;
    },
    [login.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
  },
});
//actions
export const cardActions = cardSlices.actions;

//selectors

//reducer
const cardReducer = cardSlices.reducer;
export default cardReducer;
