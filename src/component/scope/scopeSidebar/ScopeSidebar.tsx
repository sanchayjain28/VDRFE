import { useState, useMemo, useEffect } from "react";
import { Checkbox, App } from "antd";
import { useAppSelector } from "../../../store/hooks";
import { getTopics, ITopic, deleteTopic, getDocumentsByTopic } from "../../../services/vdrAgent";
import "./ScopeSidebar.scss";

interface ScopeSidebarProps {
  showCheckboxes?: boolean;
  selectedScopes?: string[];
  onScopeSelectionChange?: (selectedScopes: string[]) => void;
  onTopicSelect?: (topic: ITopic | null) => void;
  uncategorisedCount?: number;
}

const ScopeSidebar = ({ showCheckboxes = false, selectedScopes = [], onScopeSelectionChange, onTopicSelect, uncategorisedCount }: ScopeSidebarProps) => {
  const { message } = App.useApp();
  const [activeScopeId, setActiveScopeId] = useState<string | null>(null);

  // Get scopes from Redux store (locally added scopes via ADD SCOPE button)
  const reduxScopes = useAppSelector((state) => state.scope.scopes);

  // Get selected project ID
  const projectId = useAppSelector((state) => state.app.selectedProjectId);

  // API-fetched topics
  const [apiTopics, setApiTopics] = useState<ITopic[]>([]);
  const [isTopicsLoading, setIsTopicsLoading] = useState(false);
  const [topicDocCounts, setTopicDocCounts] = useState<Record<string, number>>({});

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
        // Fetch document count for each topic
        Promise.all(topics.map((t) => getDocumentsByTopic(t.id, 1, 0))).then((results) => {
          const counts: Record<string, number> = {};
          topics.forEach((t, i) => {
            counts[t.id] = results[i]?.total_count ?? 0;
          });
          setTopicDocCounts(counts);
        });
      })
      .finally(() => setIsTopicsLoading(false));
  }, [projectId]);

  // Merge API topics with Redux scopes into a unified display list
  const combinedScopes = useMemo(() => {
    const apiItems = apiTopics.map((t) => ({ id: t.id, displayName: t.name }));
    const reduxItems = reduxScopes.map((s) => ({ id: s.id, displayName: s.scopeName }));
    return [...apiItems, ...reduxItems];
  }, [apiTopics, reduxScopes]);

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

  const handleDeleteTopic = async (topicId: string) => {
    const success = await deleteTopic(topicId);
    if (success) {
      setApiTopics((prev) => prev.filter((t) => t.id !== topicId));
      message.success("Topic deleted.");
      // If deleted topic was active, clear selection
      if (activeScopeId === topicId) {
        setActiveScopeId(null);
        onTopicSelect?.(null);
      }
    } else {
      message.error("Failed to delete topic. Please try again.");
    }
  };

  const handleUncategorisedClick = () => {
    setActiveScopeId("__uncategorised__");
    onTopicSelect?.({
      id: "__uncategorised__",
      name: "Uncategorised",
      instruction: "",
      project_id: projectId ?? "",
      is_active: true,
      created_at: "",
      updated_at: "",
    } as ITopic);
  };

  return (
    <>
      <h4 className="sidebar-heading">Scope</h4>

      <div className="scope-list">
        {isTopicsLoading && combinedScopes.length === 0 ? (
          <div className="no-scopes-message">Loading topics...</div>
        ) : combinedScopes.length === 0 ? (
          <div className="no-scopes-message">No scopes available</div>
        ) : (
          combinedScopes.map((scope) => {
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
                  <div className="scope-doc-count-circle">
                    <span>{topicDocCounts[scope.id] ?? 0}</span>
                  </div>
                )}
                <span className="side-menu-text">{scope.displayName}</span>
              </div>
            );
          })
        )}

        {!showCheckboxes && (
          <>
            <div className="scope-list-divider" />
            <div
              className={`scope-item uncategorised-item ${activeScopeId === "__uncategorised__" ? "active" : ""}`}
              onClick={handleUncategorisedClick}
            >
              <span className="side-menu-text">Uncategorised</span>
              <span className="uncategorised-count">({uncategorisedCount ?? 0})</span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ScopeSidebar;
