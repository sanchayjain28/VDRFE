export interface ISharePointSlice {
    SharePointList: ISharepointList[];
    isSharepointListLoading: boolean;
    syncedFiles: ISharepointList[];
    schedule: string | null;
    syncHour: number | null;
    syncMinute: number | null;
    isLoadingSync: boolean;
    isLoadingUnsync: boolean;
    projectDocuments: IProjectDocument[];
    isProjectDocumentsLoading: boolean;
    projectDocumentsTotal: number;
    projectDocumentsCurrentPage: number;
}

export interface ISharePointListResponse {
    items?: ISharepointList[]; // For recursive=false
    files?: ISharepointList[]; // For recursive=true
    folders_count?: number;
    files_count?: number;
    count?: number;
}

export interface ISharepointList {
    id: string;
    is_folder: boolean;
    last_modified_datetime: string;
    mime_type: string | null;
    name: string;
    path: string;
    size: number | null;
    web_url: string;
    children?: ISharepointList[]; // For tree structure
}

export interface IProjectDocument {
    id: string;
    source_file_id: string;
    name: string;
    file_name: string;
    file_type: string;
    file_path: string;
    source: string;
    status: "processing" | "completed" | "failed" | "pending";
    page_count: number | null;
    file_size: number | null;
    file_content_hash: string | null;
    web_url: string;
    last_modified_datetime: string | null;
    synced_at: string;
    created_at: string;
    updated_at: string;
    children?: IProjectDocument[]; // For tree structure
    type?: "folder" | "file"; // For folder navigation
    is_folder?: boolean; // For folder navigation
    path?: string;
}

export interface IProjectDocumentsResponse {
    documents: IProjectDocument[];
    total: number;
    skip: number;
    limit: number;
}

export interface ISource {
    type: "folder" | "file";
    path: string;
    recursive: boolean | null;
    file_pattern: string | null;
    id: string | null;
    last_modified_datetime: string | null;
    mime_type: string | null;
    name: string | null;
    size: number | null;
    web_url: string | null;
}

export interface IProjectDetails {
    id: string;
    name: string;
    description: string;
    sources: ISource[];
    sync_config: {
        enabled: boolean;
        schedule: string | null;
        last_sync_at?: string | null;
        next_sync_at?: string | null;
        hour?: number | null;
        minute?: number | null;
    };
    is_active: boolean;
    created_by: string;
    created_at: string;
    updated_at: string;
    sync_status: string | null;
    [key: string]: any;
}
