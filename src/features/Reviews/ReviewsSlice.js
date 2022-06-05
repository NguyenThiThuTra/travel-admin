import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import reviewApi from 'api/reviewApi';
import { setLoadingAction, setLoadingApp } from 'features/commonSlice';

export const getAllReviews = createAsyncThunk(
  'reviews/getAllReviews',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      // dispatch(setLoadingApp(true));
      const response = await reviewApi.getAllReviews(payload);
      // dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      // dispatch(setLoadingApp(false));
      message.error(error?.response?.data?.message);
      return rejectWithValue(error?.response.data);
    }
  }
);

export const getAllReviewDestination = createAsyncThunk(
  'reviews/getAllReviewDestination',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await reviewApi.getAllReviewDestination(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      message.error(error?.response?.data?.message);
      return rejectWithValue(error?.response.data);
    }
  }
);

export const getReview = createAsyncThunk(
  'reviews/getReview',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(false));
      const response = await reviewApi.getReview(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      message.error(error?.response?.data?.message);
      return rejectWithValue(error?.response.data);
    }
  }
);

export const postReview = createAsyncThunk(
  'reviews/postReview',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await reviewApi.postReview(payload);
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      message.error(error?.response?.data?.message);
      return rejectWithValue(error?.response.data);
    }
  }
);

export const updateLikeReview = createAsyncThunk(
  'reviews/likeReview',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingAction(true));
      const response = await reviewApi.likeReview(payload);
      dispatch(setLoadingAction(false));
      return response;
    } catch (error) {
      dispatch(setLoadingAction(false));
      message.error(error?.response?.data?.message);
      return rejectWithValue(error?.response.data);
    }
  }
);

const initialState = {
  reviews: null,
  review: null,
  reviewDestination: null,
  likeReview: null,
};
const reviewsSlices = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: {
    // getAllReviews
    [getAllReviews.fulfilled]: (state, action) => {
      state.reviews = action.payload;
    },
    [getAllReviews.rejected]: (state, action) => {
      state.reviews = null;
    },
    // getReview
    [getReview.fulfilled]: (state, action) => {
      state.review = action.payload;
    },
    [getReview.rejected]: (state, action) => {
      state.review = null;
    },
    // getAllReviewDestination
    [getAllReviewDestination.fulfilled]: (state, action) => {
      state.reviewDestination = action.payload;
    },
    [getAllReviewDestination.rejected]: (state, action) => {
      state.reviewDestination = null;
    },
    // updateLikeReview
    [updateLikeReview.fulfilled]: (state, action) => {
      state.likeReview = action.payload;
    },
    [updateLikeReview.rejected]: (state, action) => {
      state.likeReview = null;
    },
  },
});
//actions
export const reviewsActions = reviewsSlices.actions;

//selectors
export const useReviewsSelector = (state) => state.reviews;
export const useDataReviewsSelector = (state) => state.reviews.reviews;
export const useReviewDestinationSelector = (state) =>
  state.reviews.reviewDestination;
export const useLikeReviewSelector = (state) => state.reviews.likeReview;
export const useDataReviewSelector = (state) => state.reviews.review;

//reducer
const reviewsReducer = reviewsSlices.reducer;
export default reviewsReducer;
