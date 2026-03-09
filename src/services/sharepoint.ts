import { toast } from "react-toastify";
import { store } from "../store/store";
import {
    setIsSharepointListLoading,
    setSharePointList,
    setProjectDocuments,
    setIsProjectDocumentsLoading,
    setProjectDocumentsTotal,
} from "../store/sharepoint/sharepointSlice";
import { get, ingestionApi, post } from "./apiClients";
import type { ISharePointListResponse, IProjectDocumentsResponse } from "../store/sharepoint/sharepoint.interface";
import { LocalStorageName } from "../shared/constants";

const getUserId = (): string => {
    try {
        const raw = localStorage.getItem(LocalStorageName.User);
        if (!raw) return "";
        const user = JSON.parse(raw);
        return user?.name || user?.id || user?.email || "";
    } catch {
        return "";
    }
};

/**
 * List SharePoint items (Files/Folders)
 * @param folderPath Path to the folder to list (default: /)
 * @param recursive Whether to list all files recursively (default: false)
 */
export const getSharePointList = async (
    folderPath: string = "/",
    recursive: boolean = false,
): Promise<ISharePointListResponse | undefined> => {
    try {
        store.dispatch(setIsSharepointListLoading(true));
        const res = await get(ingestionApi, `sharepoint/list`, {
            params: {
                folder_path: folderPath,
                recursive,
            },
        });

        store.dispatch(setSharePointList(res?.items || []));
        return res;
    } catch (error: any) {
        console.error("getSharePointList error", error);
        toast.error("Failed to load sharePoint list.");
        return undefined;
    } finally {
        store.dispatch(setIsSharepointListLoading(false));
    }
};

/**
 * List project documents
 * GET /projects/{projectId}/documents?view=list&limit=100
 */
export const getProjectDocuments = async (
    projectId: string,
    limit: number = 100,
): Promise<IProjectDocumentsResponse | undefined> => {
    try {
        store.dispatch(setIsProjectDocumentsLoading(true));
        const res = await get(ingestionApi, `projects/${projectId}/documents`, {
            params: {
                view: "list",
                limit,
            },
        });

        store.dispatch(setProjectDocuments(res?.documents || []));
        store.dispatch(setProjectDocumentsTotal(res?.total || 0));
        return res;
    } catch (error: any) {
        console.error("getProjectDocuments error", error);
        toast.error("Failed to load project documents.");
        return undefined;
    } finally {
        store.dispatch(setIsProjectDocumentsLoading(false));
    }
};

/**
 * GET /projects/{project_id}/sync/status
 * Returns e.g. { status: "in_progress" | "completed" | "failed" | "idle", ... }
 */
export const getSyncStatus = async (projectId: string): Promise<{ status: string } | undefined> => {
    try {
        return await get(ingestionApi, `projects/${projectId}/sync/status`);
    } catch (error: any) {
        console.error("getSyncStatus error", error);
        return undefined;
    }
};

/**
 * GET /projects/{project_id}/sync/progress
 * Returns e.g. { total: number, processed: number, status: string, ... }
 */
export const getSyncProgress = async (projectId: string): Promise<{ total: number; processed: number; status: string; workflow_status: string } | undefined> => {
    try {
        return await get(ingestionApi, `projects/${projectId}/sync/progress`);
    } catch (error: any) {
        console.error("getSyncProgress error", error);
        return undefined;
    }
};

/**
 * Trigger sync for a project
 * POST /projects/{project_id}/sync — no body, requires x-user-id header
 */
export const syncProject = async (projectId: string): Promise<any> => {
    try {
        const res = await post(ingestionApi, `projects/${projectId}/sync`, null, {
            headers: { "x-user-id": getUserId() },
        });
        toast.success("Sync started successfully.");
        return res;
    } catch (error: any) {
        console.error("syncProject error", error);
        toast.error("Failed to start sync.");
        return undefined;
    }
};
