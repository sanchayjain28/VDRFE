import type { Dayjs } from "dayjs";

export interface Scope {
  id: string;
  scopeName: string;
  description?: string;
  category: string;
  riskLevel: string;
  scopeOwner?: string;
  defaultDueDate?: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ScopeFormValues {
  scopeName: string;
  description?: string;
  category: string;
  riskLevel: string;
  scopeOwner?: string;
  defaultDueDate?: Dayjs;
}

export interface IScopeSlice {
  scopes: Scope[];
  isLoading: boolean;
  error: string | null;
}
