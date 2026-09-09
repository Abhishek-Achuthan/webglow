import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

const storage = {
  getItem: (key: string) => {
    const value = window.localStorage.getItem(key);
    console.log(`[redux-persist] getItem: ${key}`, value);
    return Promise.resolve(value);
  },
  setItem: (key: string, value: string) => {
    return Promise.resolve(window.localStorage.setItem(key, value));
  },
  removeItem: (key: string) => {
    return Promise.resolve(window.localStorage.removeItem(key));
  },
};
import authReducer from './slices/auth.slice';
import tokenReducer from './slices/token.slice';

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist the auth slice
};

const rootReducer = combineReducers({
  auth: authReducer,
  token: tokenReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
