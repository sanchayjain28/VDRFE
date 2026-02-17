import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import type { IScopeSlice, Scope, ScopeFormValues } from "./scopeInterface";

const initialState: IScopeSlice = {
  scopes: [],
  isLoading: false,
  error: null,
};

export const scopeSlice = createSlice({
  name: "scopeSlice",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      Object.assign(state, initialState);
    });
  },
  reducers: {
    // Add a new scope
    addScope: (state, action: PayloadAction<ScopeFormValues>) => {
      const newScope: Scope = {
        id: `scope-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        scopeName: action.payload.scopeName,
        description: action.payload.description,
        category: action.payload.category,
        riskLevel: action.payload.riskLevel,
        scopeOwner: action.payload.scopeOwner,
        defaultDueDate: action.payload.defaultDueDate?.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.scopes.push(newScope);
      state.error = null;
    },

    // Update an existing scope
    updateScope: (state, action: PayloadAction<{ id: string; updates: Partial<ScopeFormValues> }>) => {
      const index = state.scopes.findIndex((scope) => scope.id === action.payload.id);
      if (index !== -1) {
        const scope = state.scopes[index];
        state.scopes[index] = {
          ...scope,
          ...action.payload.updates,
          defaultDueDate: action.payload.updates.defaultDueDate
            ? (action.payload.updates.defaultDueDate as any).toISOString()
            : scope.defaultDueDate,
          updatedAt: new Date().toISOString(),
        };
        state.error = null;
      }
    },

    // Delete a scope
    deleteScope: (state, action: PayloadAction<string>) => {
      state.scopes = state.scopes.filter((scope) => scope.id !== action.payload);
      state.error = null;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { addScope, updateScope, deleteScope, setLoading, setError, clearError } = scopeSlice.actions;

export default scopeSlice.reducer;
