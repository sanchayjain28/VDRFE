import { toast } from "react-toastify";
import { get, post, patch, ingestionApi } from "./apiClients";
import { store } from "../store/store";
import { setSyncedFiles } from "../store/sharepoint/sharepointSlice";
import type { ISource, IProjectDetails } from "../store/sharepoint/sharepoint.interface";

export interface IProject {
    id: string;
    name: string;
    status?: string;
    created_at?: string;
    risk_level?: string;
    scope_flagged?: number;
    scope_completed?: number;
    scope_total?: number;
    documents_completed?: number;
    documents_in_progress?: number;
    documents_total?: number;
    collaborators?: { id: string; name: string; avatar?: string; role?: string }[];
    [key: string]: any;
}

export interface IProjectsResponse {
    projects: IProject[];
    total: number;
    page: number;
    limit: number;
}

/**
 * Get project details by ID
 * Also populates syncedFiles in Redux from project sources
 */
export const getProjectDetails = async (
    projectId: string,
): Promise<IProjectDetails | undefined> => {
    try {
        const res = await get(ingestionApi, `projects/${projectId}`);
        if (res?.sources) {
            const transformedItems = res.sources.map((item: ISource) => ({
                id: item.id || "",
                name: item.name || "",
                is_folder: item.type === "folder",
                path: item.path,
                web_url: item.web_url || "",
                last_modified_datetime: item.last_modified_datetime || "",
                mime_type: item.mime_type || null,
                size: item.size || null,
            }));
            store.dispatch(setSyncedFiles(transformedItems));
        }
        return res;
    } catch (error: any) {
        console.error("getProjectDetails error", error);
        return undefined;
    }
};

/**
 * Save sources to a project via PATCH
 * PATCH /projects/{project_id} with { sources: [...] }
 */
export const updateProjectSources = async (
    projectId: string,
    sources: ISource[],
): Promise<any> => {
    try {
        const res = await patch(ingestionApi, `projects/${projectId}`, { sources });
        if (res.status === 200) {
            toast.success("Sources saved successfully");
        }
        return res;
    } catch (error: any) {
        console.error("updateProjectSources error", error);
        toast.error("Failed to save sources.");
        return undefined;
    }
};

export interface ICreateProjectPayload {
    name: string;
    description?: string;
    taxonomy: { level1: string; level2: string };
    sources?: ISource[];
}

/**
 * Create a new project via ingestion-service
 * POST /projects (X-Platform: vdr is set on ingestionApi)
 */
export const createProject = async (
    payload: ICreateProjectPayload,
): Promise<IProject | undefined> => {
    try {
        const res = await post(ingestionApi, "projects", payload);
        if (res.status === 201) {
            toast.success("Project created successfully");
            return res.data;
        }
        return res.data;
    } catch (error: any) {
        console.error("createProject error", error);
        const detail = error?.detail || "Failed to create project.";
        toast.error(typeof detail === "string" ? detail : "Failed to create project.");
        return undefined;
    }
};

export const getProjects = async (params: {
    limit?: number;
    page?: number;
    q?: string;
} = {}): Promise<IProjectsResponse | undefined> => {
    try {
        const res = await get(ingestionApi, "projects", {
            params: {
                limit: params.limit ?? 12,
                page: params.page ?? 1,
                q: params.q ?? "",
            },
        });
        return res;
    } catch (error: any) {
        console.error("getProjects error", error);
        toast.error("Failed to load projects.");
        return undefined;
    }
};
