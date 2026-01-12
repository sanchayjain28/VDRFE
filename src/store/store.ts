import type { UnknownAction } from "@reduxjs/toolkit";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import appSlice from "./app/appSlice";
import knowledgeAIChatSlice from "./knowledgeAIChat/knowledgeAIChatSlice";

//  Persist config
const persistConfig = {
  key: "erm-frontend",
  storage, // localStorage
  whitelist: ["app", "knowledgeAIChat"],
};

//  Combine reducers
const appReducer = combineReducers({
  app: appSlice,
  knowledgeAIChat: knowledgeAIChatSlice,
});

//  Types
type RootStateTemp = ReturnType<typeof appReducer>;

// "initializationStore" action type
type InitializationAction = { type: "initializationStore" };

// Root reducer that handles initialization action
const rootReducer = (
  state: RootStateTemp | undefined,
  action: UnknownAction | InitializationAction
): RootStateTemp => {
  if (action.type === "initializationStore") {
    return appReducer(undefined, { type: "initializationStore" });
  }
  return appReducer(state, action);
};

//  Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

//  Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [REHYDRATE, PERSIST, REGISTER, FLUSH, PAUSE, PURGE],
      },
    }),
  devTools: false,
});

//  Persistor
export const persistor = persistStore(store);

//  Types for app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
