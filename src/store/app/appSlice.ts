import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import type { IAppSlice } from "./appInterface";

const initialState: IAppSlice = {
  isProjectLoading: false,
};

export const appSlice = createSlice({
  name: "appSlice",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      Object.assign(state, initialState);
    });
  },
  reducers: {
    setIProjectLoading: (state, action: PayloadAction<boolean>) => {
      state.isProjectLoading = action.payload;
    },
  },
});

export const { setIProjectLoading } = appSlice.actions;

export default appSlice.reducer;
