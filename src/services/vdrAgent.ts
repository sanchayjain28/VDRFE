import { toast } from "react-toastify";
import { get, patch, post, deleteRequest, vdrAgentApi } from "./apiClients";

export interface ITopic {
  id: string;
  project_id: string;
  name: string;
  instruction: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IDocumentListItem {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  page_count: number | null;
  summary_status: "pending" | "processing" | "done" | "failed";
  summary_text: string | null;
  fitment_done_count: number;
  fitment_total_count: number;
}

export interface IFitmentItem {
  topic_id: string;
  topic_name: string;
  status: "pending" | "done" | "failed";
  reasoning: string | null;
}

export const createTopic = async (
  projectId: string,
  name: string,
  instruction?: string,
): Promise<ITopic | undefined> => {
  try {
    const res = await post(vdrAgentApi, "topics", { project_id: projectId, name, instruction: instruction ?? "" });
    return res.data as ITopic;
  } catch (error) {
    console.error("createTopic error:", error);
    return undefined;
  }
};

export const getTopics = async (projectId: string): Promise<ITopic[] | undefined> => {
  try {
    return await get(vdrAgentApi, "topics", { params: { project_id: projectId } });
  } catch (error) {
    console.error("getTopics error:", error);
    toast.error("Failed to load topics.");
    return undefined;
  }
};

export const getVdrDocuments = async (projectId: string): Promise<IDocumentListItem[] | undefined> => {
  try {
    return await get(vdrAgentApi, "documents", { params: { project_id: projectId } });
  } catch (error) {
    if ((error as any)?.status === 404 || (error as any)?.response?.status === 404) {
      return [];
    }
    console.error("getVdrDocuments error:", error);
    return undefined;
  }
};

export const getDocumentFitment = async (documentId: string): Promise<IFitmentItem[] | undefined> => {
  try {
    return await get(vdrAgentApi, `documents/${documentId}/fitment`);
  } catch (error) {
    console.error("getDocumentFitment error:", error);
    return undefined;
  }
};

export const updateTopicInstruction = async (
  topicId: string,
  instruction: string,
): Promise<ITopic | undefined> => {
  try {
    const res = await patch(vdrAgentApi, `topics/${topicId}`, { instruction });
    return res.data as ITopic;
  } catch (error) {
    console.error("updateTopicInstruction error:", error);
    return undefined;
  }
};

export const deleteTopic = async (topicId: string): Promise<boolean> => {
  try {
    await deleteRequest(vdrAgentApi, `topics/${topicId}`);
    return true;
  } catch (error) {
    console.error("deleteTopic error:", error);
    return false;
  }
};
