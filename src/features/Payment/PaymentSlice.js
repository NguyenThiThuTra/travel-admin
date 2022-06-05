import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import paymentApi from 'api/paymentApi';
import { setLoadingApp } from 'features/commonSlice';

export const createVNPayment = createAsyncThunk(
  'payment/VNPayment',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await paymentApi.createVNPayment(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error);
    }
  }
);

export const ipnVNPayment = createAsyncThunk(
  'payment/VNPayment/ipn',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await paymentApi.ipnVNPayment(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error);
    }
  }
);

export const returnVNPayment = createAsyncThunk(
  'payment/VNPayment/return',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await paymentApi.returnVNPayment(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  payment: null,
  dataIpnVNPayment: null,
  dataReturnVNPayment: null,
};
const paymentSlices = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: {
    // createVNPayment
    [createVNPayment.fulfilled]: (state, action) => {
      state.payment = action.payload;
    },
    [createVNPayment.rejected]: (state, action) => {
      state.payment = null;
    },
    // ipnVNPayment
    [ipnVNPayment.fulfilled]: (state, action) => {
      state.dataIpnVNPayment = action.payload;
    },
    [ipnVNPayment.rejected]: (state, action) => {
      state.dataIpnVNPayment = null;
    },
    // returnVNPayment
    [returnVNPayment.fulfilled]: (state, action) => {
      state.dataReturnVNPayment = action.payload;
    },
    [returnVNPayment.rejected]: (state, action) => {
      state.dataReturnVNPayment = null;
    },
  },
});
//actions
export const paymentActions = paymentSlices.actions;

//selectors
export const usePaymentSelector = (state) => state.payment;
export const useDataPaymentSelector = (state) => state.payment.payment;
export const useDataIpnVNPaymentSelector = (state) =>
  state.payment.dataIpnVNPayment;
export const useDataReturnVNPaymentSelector = (state) =>
  state.payment.dataReturnVNPayment;

//reducer
const paymentReducer = paymentSlices.reducer;
export default paymentReducer;
