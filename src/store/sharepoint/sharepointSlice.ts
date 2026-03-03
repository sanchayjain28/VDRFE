import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import type { IProjectDocument, ISharepointList, ISharePointSlice } from "./sharepoint.interface";

const initialState: ISharePointSlice = {
    SharePointList: [],
    isSharepointListLoading: false,
    syncedFiles: [],
    schedule: null,
    syncHour: null,
    syncMinute: null,
    isLoadingSync: false,
    isLoadingUnsync: false,
    projectDocuments: [],
    isProjectDocumentsLoading: false,
    projectDocumentsTotal: 0,
    projectDocumentsCurrentPage: 1,
};

export const sharepointSlice = createSlice({
    name: "sharepointSlice",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(PURGE, (state) => {
            Object.assign(state, initialState);
        });
    },
    reducers: {
        setSharePointList: (state, action: PayloadAction<ISharepointList[]>) => {
            state.SharePointList = action.payload;
        },

        setIsSharepointListLoading: (state, action: PayloadAction<boolean>) => {
            state.isSharepointListLoading = action.payload;
        },

        setSyncedFiles: (state, action: PayloadAction<ISharepointList[]>) => {
            state.syncedFiles = action.payload;
        },

        setSchedule: (state, action: PayloadAction<string | null>) => {
            state.schedule = action.payload;
        },

        setSyncHour: (state, action: PayloadAction<number | null>) => {
            state.syncHour = action.payload;
        },

        setSyncMinute: (state, action: PayloadAction<number | null>) => {
            state.syncMinute = action.payload;
        },

        setIsLoadingSync: (state, action: PayloadAction<boolean>) => {
            state.isLoadingSync = action.payload;
        },

        setIsLoadingUnsync: (state, action: PayloadAction<boolean>) => {
            state.isLoadingUnsync = action.payload;
        },

        setProjectDocuments: (state, action: PayloadAction<IProjectDocument[]>) => {
            state.projectDocuments = action.payload;
        },

        setIsProjectDocumentsLoading: (state, action: PayloadAction<boolean>) => {
            state.isProjectDocumentsLoading = action.payload;
        },

        setProjectDocumentsTotal: (state, action: PayloadAction<number>) => {
            state.projectDocumentsTotal = action.payload;
        },

        setProjectDocumentsCurrentPage: (state, action: PayloadAction<number>) => {
            state.projectDocumentsCurrentPage = action.payload;
        },
    },
});

export const {
    setSharePointList,
    setIsSharepointListLoading,
    setSyncedFiles,
    setSchedule,
    setSyncHour,
    setSyncMinute,
    setIsLoadingSync,
    setIsLoadingUnsync,
    setProjectDocuments,
    setIsProjectDocumentsLoading,
    setProjectDocumentsTotal,
    setProjectDocumentsCurrentPage,
} = sharepointSlice.actions;

export default sharepointSlice.reducer;
