import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { setLoadingApp } from 'features/commonSlice';
import orderApi from '../../api/orderApi';

export const addOrder = createAsyncThunk(
  'order/addOrder',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await orderApi.add(payload);
      message.success('Tiến hành thanh toán');
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      message.error('Tiến hành thanh toán thất bại');
      return rejectWithValue(error?.response.data);
    }
  }
);

export const getOrder = createAsyncThunk(
  'order/getOrder',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await orderApi.getOne(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      message.error('Lấy đơn hàng chi tiết thất bại');
      return rejectWithValue(error?.response.data);
    }
  }
);

export const updateOrder = createAsyncThunk(
  'order/updateOrder',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await orderApi.updateOne(payload);
      message.success('Cập nhật trạng thái đơn hàng thành công');
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      message.error('Cập nhật trạng thái đơn hàng thất bại');
      return rejectWithValue(error?.response.data);
    }
  }
);

export const getAllOrder = createAsyncThunk(
  'order/getAllOrder',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await orderApi.getAll(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error?.response.data);
    }
  }
);

export const getAllOrderAction = createAsyncThunk(
  'order/getAllOrderAction',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await orderApi.getAll(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response.data);
    }
  }
);

const initialState = {
  order: null,
  orderDetail: null,
  updateOrder: null,
  deleteOrder: null,
  addOrder: null,
  loading: false,
  error: undefined,
};
const orderSlices = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetAddOrder: (state) => {
      state.addOrder = null;
      state.loading = false;
      state.error = undefined;
    },
  },
  extraReducers: {
    // add order
    [addOrder.fulfilled]: (state, action) => {
      state.addOrder = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [addOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.addOrder = null;
    },
    [addOrder.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
      state.addOrder = null;
    },
    // get order
    [getOrder.fulfilled]: (state, action) => {
      state.orderDetail = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [getOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.orderDetail = null;
    },
    [getOrder.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    // update order
    [updateOrder.fulfilled]: (state, action) => {
      state.updateOrder = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [updateOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [updateOrder.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    // get all order
    [getAllOrder.fulfilled]: (state, action) => {
      state.order = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [getAllOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getAllOrder.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    // getAllOrderAction
    [getAllOrderAction.fulfilled]: (state, action) => {
      state.order = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [getAllOrderAction.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getAllOrderAction.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
  },
});
//actions
export const orderActions = orderSlices.actions;
//selectors

export const useOrderSelector = (state) => state.order.order;
export const useUpdateOrderStatusSelector = (state) => state.order.updateOrder;
export const useDeleteOrderSelector = (state) => state.order.deleteOrder;
export const useOrderDetailSelector = (state) => state.order.orderDetail;

//reducer
const orderReducer = orderSlices.reducer;
export default orderReducer;
