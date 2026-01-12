export enum PATHS {
  home = "/",
  login = "/login",
  projects = "/projects",
  projectDetails = "/project-details",
  scopeDetails = "/scope-details",
  createProject = "/create-project",
}

export enum LocalStorageName {
  User = "user_vdr",
  Token = "token_vdr",
  RefreshToken = "refresh_token_vdr",
  MultiUploadAssetIds = "multiUploadAssetIds_vdr",
  SPAccessToken = "spAccessToken",
}

export enum MessageType {
  User = "user",
  Assistant = "assistant",
}

export const PAGE_SIZE = {
  chatHistory: 20,
  projects: 20,
};
