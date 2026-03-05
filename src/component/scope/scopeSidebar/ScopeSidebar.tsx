import { useState, useMemo, useEffect } from "react";
import { Input, Button, Progress, Checkbox } from "antd";
import { AddScope } from "../../../component";
import { useAppSelector } from "../../../store/hooks";
import { getTopics, ITopic } from "../../../services/vdrAgent";
import "./ScopeSidebar.scss";

interface ScopeSidebarProps {
  showCheckboxes?: boolean;
  selectedScopes?: string[];
  onScopeSelectionChange?: (selectedScopes: string[]) => void;
  onTopicSelect?: (topic: ITopic | null) => void;
}

const ScopeSidebar = ({ showCheckboxes = false, selectedScopes = [], onScopeSelectionChange, onTopicSelect }: ScopeSidebarProps) => {
  const [isAddScopeOpen, setIsAddScopeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeScopeId, setActiveScopeId] = useState<string | null>(null);

  // Get scopes from Redux store (locally added scopes via ADD SCOPE button)
  const reduxScopes = useAppSelector((state) => state.scope.scopes);

  // Get selected project ID
  const projectId = useAppSelector((state) => state.app.selectedProjectId);

  // API-fetched topics
  const [apiTopics, setApiTopics] = useState<ITopic[]>([]);
  const [isTopicsLoading, setIsTopicsLoading] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    setIsTopicsLoading(true);
    getTopics(projectId)
      .then((data) => {
        const topics = data ?? [];
        setApiTopics(topics);
        if (topics.length > 0) {
          setActiveScopeId(topics[0].id);
          onTopicSelect?.(topics[0]);
        }
      })
      .finally(() => setIsTopicsLoading(false));
  }, [projectId]);

  // Merge API topics with Redux scopes into a unified display list
  const combinedScopes = useMemo(() => {
    const apiItems = apiTopics.map((t) => ({ id: t.id, displayName: t.name }));
    const reduxItems = reduxScopes.map((s) => ({ id: s.id, displayName: s.scopeName }));
    return [...apiItems, ...reduxItems];
  }, [apiTopics, reduxScopes]);

  // Filter combined scopes based on search term
  const filteredScopes = useMemo(() => {
    if (!searchTerm.trim()) return combinedScopes;
    const lower = searchTerm.toLowerCase();
    return combinedScopes.filter((s) => s.displayName.toLowerCase().includes(lower));
  }, [combinedScopes, searchTerm]);

  // Determine if a scope is selected (by displayName for backward compatibility)
  const isScopeSelected = (displayName: string) => {
    return selectedScopes.includes(displayName);
  };

  // Handle scope selection
  const handleScopeToggle = (displayName: string) => {
    if (!showCheckboxes) return;
    const newSelected = isScopeSelected(displayName)
      ? selectedScopes.filter((scope) => scope !== displayName)
      : [...selectedScopes, displayName];
    onScopeSelectionChange?.(newSelected);
  };

  const handleScopeClick = (scopeId: string, displayName: string) => {
    if (showCheckboxes) return;
    setActiveScopeId(scopeId);
    const topic = apiTopics.find((t) => t.id === scopeId) ?? null;
    onTopicSelect?.(topic ?? { id: scopeId, name: displayName, instruction: "", project_id: "", is_active: true, created_at: "", updated_at: "" });
  };

  return (
    <>
      <h4 className="sidebar-heading">Scope</h4>
      <div className="sidebar-search-wrapper">
        <Input
          placeholder="Quick find"
          prefix={<i className="erm-icon search-icon" />}
          className="quick-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="button"
          className="status-trigger"
          aria-label="Filter by status"
        >
          <i className="erm-icon filter-icon"></i>
        </button>
      </div>

      <Button
        type="link"
        className="add-scope"
        onClick={() => setIsAddScopeOpen(true)}
      >
        <i className="erm-icon plus-icon"></i> ADD SCOPE
      </Button>

      <div className="scope-list">
        {isTopicsLoading && filteredScopes.length === 0 ? (
          <div className="no-scopes-message">Loading topics...</div>
        ) : filteredScopes.length === 0 ? (
          <div className="no-scopes-message">
            {searchTerm ? "No scopes found" : "No scopes available"}
          </div>
        ) : (
          filteredScopes.map((scope) => {
            const isSelected = isScopeSelected(scope.displayName);
            const isActive = !showCheckboxes && scope.id === activeScopeId;

            return (
              <div
                key={scope.id}
                className={`scope-item ${isActive ? "active" : ""} ${showCheckboxes ? "with-checkbox" : ""}`}
                onClick={() => showCheckboxes ? handleScopeToggle(scope.displayName) : handleScopeClick(scope.id, scope.displayName)}
              >
                {showCheckboxes && (
                  <Checkbox
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleScopeToggle(scope.displayName);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                {!showCheckboxes && (
                  <Progress
                    type="circle"
                    percent={50}
                    size={24}
                    strokeWidth={24}
                    strokeColor="#82A78D"
                  />
                )}
                <span className="side-menu-text">{scope.displayName}</span>
                {!showCheckboxes && (
                  <span className="flag-icon-wrap">
                    <i className="erm-icon flag-icon" />
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      <AddScope
        open={isAddScopeOpen}
        onClose={() => setIsAddScopeOpen(false)}
        onSuccess={(topic) => {
          setApiTopics((prev) => [...prev, topic]);
          setActiveScopeId(topic.id);
          onTopicSelect?.(topic);
        }}
      />
    </>
  );
};

export default ScopeSidebar;
