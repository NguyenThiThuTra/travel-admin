import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userApi from 'api/userApi';
import { setLoadingApp } from 'features/commonSlice';

export const getUser = createAsyncThunk(
  'auth/get-receiver',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await userApi.getUser(payload);
      dispatch(setLoadingApp(false));
      return response?.data;
    } catch (error) {
      dispatch(setLoadingApp(false));
      return rejectWithValue(error?.response.data);
    }
  }
);

const initialState = {
  messages: null,
  listHomestayChatBox: null,
  receiver: null,
  openPopupChatBox: false,
};
const chatBoxSlices = createSlice({
  name: 'chatBox',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setReceiver: (state, action) => {
      state.receiver = action.payload;
    },
    setOpenPopupChatBox: (state, action) => {
      state.openPopupChatBox = action.payload;
    },
    toggleOpenPopupChatBox: (state, action) => {
      state.openPopupChatBox = !state.openPopupChatBox;
    },
  },
  extraReducers: {
    [getUser.fulfilled]: (state, action) => {
      state.receiver = action.payload;
    },
    [getUser.rejected]: (state, action) => {
      state.receiver = null;
    },
  },
});
//actions
export const chatBoxActions = chatBoxSlices.actions;
export const {
  setMessages,
  setReceiver,
  setOpenPopupChatBox,
  toggleOpenPopupChatBox,
} = chatBoxActions;

//selectors
export const useChatBoxSelector = (state) => state.chatBox;
export const useMessagesChatBoxSelector = (state) => state.chatBox.messages;
export const useListHomestayChatBoxSelector = (state) =>
  state.chatBox.listHomestayChatBox;
export const useReceiverChatBoxSelector = (state) => state.chatBox.receiver;
// openPopupChatBox
export const useOpenPopupChatBoxSelector = (state) =>
  state.chatBox.openPopupChatBox;

//reducer
const chatBoxReducer = chatBoxSlices.reducer;
export default chatBoxReducer;
