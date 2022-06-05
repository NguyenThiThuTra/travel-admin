import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  querySearch: null,
  loading: false,
  error: null,
  visibleModalLogin: false,
  loadingAction: false,
};

const commonSlices = createSlice({
  name: 'common',
  initialState,
  reducers: {
    changeQuery: (state, action) => {
      state.querySearch = action.payload;
    },
    toggleModalLogin: (state, action) => {
      state.visibleModalLogin = !state.visibleModalLogin;
    },
    setLoadingApp: (state, action) => {
      state.loading = action.payload;
    },
    setErrorApp: (state, action) => {
      state.error = action.payload;
    },
    setLoadingAction: (state, action) => {
      state.loadingAction = action.payload;
    },
  },
});
//actions
export const commonActions = commonSlices.actions;

export const {
  toggleModalLogin,
  changeQuery,
  setLoadingApp,
  setErrorApp,
  setLoadingAction,
} = commonActions;
//selectors
export const useCommonSelectors = (state) => state.common;
export const useLoadingAppSelector = (state) => state.common.loading;
export const useErrorAppSelectors = (state) => state.common.error;

export const useQuerySearchSelectors = (state) => state.common.querySearch;
export const useVisibleModalLoginSelector = (state) =>
  state.common.visibleModalLogin;
export const useLoadingActionSelector = (state) => state.common.loadingAction;

//reducer
const commonReducer = commonSlices.reducer;
export default commonReducer;
