import {
  combineReducers,
  configureStore,
  createAction,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import usersReducer from 'features/Users/UsersSlice';
import homestayReducer from 'features/Homestay/HomestaySlice';
import destinationsReducer from 'features/Destinations/DestinationsSlice';
import roomsReducer from 'features/Rooms/RoomsSlice';
import authReducer from 'features/Auth/AuthSlice';
import orderReducer from 'features/Order/OrderSlice';
import commentReducer from 'features/Comment/CommentSlice';
import paymentReducer from 'features/Payment/PaymentSlice';
import chatBoxReducer from 'features/ChatBox/ChatBoxSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import logger from 'redux-logger';
import commonReducer from 'features/commonSlice';
import reviewsReducer from 'features/Reviews/ReviewsSlice';

let middleware = [];
if (process.env.REACT_APP_NODE_ENV !== 'production') {
  middleware = [...middleware, logger];
}
const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'common',
    'users',
    'homestay',
    'room',
    'auth',
    'order',
    'comments',
    'payment',
    'chatBox',
  ],
};

const rootReducer = combineReducers({
  common: commonReducer,
  users: usersReducer,
  homestay: homestayReducer,
  destination: destinationsReducer,
  room: roomsReducer,
  auth: authReducer,
  order: orderReducer,
  comments: commentReducer,
  payment: paymentReducer,
  chatBox: chatBoxReducer,
  reviews: reviewsReducer,
});

export const resetAction = createAction('reset');

const resetTableReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    localStorage.removeItem('persist:root');
    return rootReducer(undefined, action);
  }
  return rootReducer(state, action);
};
const pReducer = persistReducer(persistConfig, resetTableReducer);

export const store = configureStore({
  reducer: pReducer,
  middleware: [
    ...getDefaultMiddleware({ serializableCheck: false }),
    ...middleware,
  ],
});
export const persistor = persistStore(store, {}, () => {});
