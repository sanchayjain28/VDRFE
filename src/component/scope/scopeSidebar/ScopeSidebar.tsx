import { useState, useMemo } from "react";
import { Input, Button, Progress, Checkbox } from "antd";
import { AddScope } from "../../../component";
import { useAppSelector } from "../../../store/hooks";
import type { Scope } from "../../../store/scope/scopeInterface";
import "./ScopeSidebar.scss";

interface ScopeSidebarProps {
  showCheckboxes?: boolean;
  selectedScopes?: string[];
  onScopeSelectionChange?: (selectedScopes: string[]) => void;
}

const ScopeSidebar = ({ showCheckboxes = false, selectedScopes = [], onScopeSelectionChange }: ScopeSidebarProps) => {
  const [isAddScopeOpen, setIsAddScopeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get scopes from Redux store
  const reduxScopes = useAppSelector((state) => state.scope.scopes);
  
  // Default scopes aligned with TOPICS MAPPED (Sustainability Leadership, Value Chain, Social, Climate, EHS)
  const defaultScopes: Scope[] = [
    // Sustainability Leadership & Governance (Governance Topic)
    { id: "default-1", scopeName: "ESG Strategy", category: "regulatory", riskLevel: "medium", createdAt: "", updatedAt: "" },
    { id: "default-2", scopeName: "Organisation and Responsibility", category: "regulatory", riskLevel: "medium", createdAt: "", updatedAt: "" },
    { id: "default-3", scopeName: "Policies and Business Ethics", category: "regulatory", riskLevel: "medium", createdAt: "", updatedAt: "" },
    { id: "default-4", scopeName: "Disclosure and Reporting", category: "regulatory", riskLevel: "medium", createdAt: "", updatedAt: "" },
    { id: "default-5", scopeName: "Risk Management & Assurance", category: "regulatory", riskLevel: "medium", createdAt: "", updatedAt: "" },
    // Value Chain (Social Topic)
    { id: "default-6", scopeName: "Customer Engagement", category: "social", riskLevel: "medium", createdAt: "", updatedAt: "" },
    { id: "default-7", scopeName: "Supply Chain Management", category: "social", riskLevel: "medium", createdAt: "", updatedAt: "" },
    { id: "default-8", scopeName: "Sustainable Products", category: "social", riskLevel: "medium", createdAt: "", updatedAt: "" },
    // Social Performance & Human Rights (Social Topic)
    { id: "default-9", scopeName: "Labour Laws & Human Rights", category: "social", riskLevel: "medium", createdAt: "", updatedAt: "" },
    { id: "default-10", scopeName: "Grievance Mechanisms and Monitoring", category: "social", riskLevel: "medium", createdAt: "", updatedAt: "" },
    { id: "default-11", scopeName: "Working Conditions & Terms of Employment", category: "social", riskLevel: "medium", createdAt: "", updatedAt: "" },
    { id: "default-12", scopeName: "Employee Engagement", category: "social", riskLevel: "medium", createdAt: "", updatedAt: "" },
    { id: "default-13", scopeName: "Diversity & Inclusion", category: "social", riskLevel: "medium", createdAt: "", updatedAt: "" },
    { id: "default-14", scopeName: "Stakeholder Engagement", category: "social", riskLevel: "medium", createdAt: "", updatedAt: "" },
    // Climate Change (Climate Change Topic)
    { id: "default-15", scopeName: "Energy Efficiency", category: "environmental", riskLevel: "medium", createdAt: "", updatedAt: "" },
    { id: "default-16", scopeName: "GHG Emissions & Carbon Footprint", category: "environmental", riskLevel: "medium", createdAt: "", updatedAt: "" },
    { id: "default-17", scopeName: "Natural Hazards & Climate Change Risk", category: "environmental", riskLevel: "medium", createdAt: "", updatedAt: "" },
    // Environmental, Health & Safety (EHS Topic)
    { id: "default-18", scopeName: "Environmental Management", category: "environmental", riskLevel: "medium", createdAt: "", updatedAt: "" },
    { id: "default-19", scopeName: "Health and Safety Management", category: "environmental", riskLevel: "medium", createdAt: "", updatedAt: "" },
  ];
  
  // Merge default scopes with Redux scopes (Redux scopes take priority)
  const allScopes = useMemo(() => {
    const defaultScopeNames = new Set(defaultScopes.map(s => s.scopeName.toLowerCase()));
    const mergedScopes = [...defaultScopes];
    
    // Add Redux scopes that don't already exist in defaults
    reduxScopes.forEach(scope => {
      if (!defaultScopeNames.has(scope.scopeName.toLowerCase())) {
        mergedScopes.push(scope);
      }
    });
    
    return mergedScopes;
  }, [reduxScopes]);
  
  // Filter scopes based on search term
  const filteredScopes = useMemo(() => {
    if (!searchTerm.trim()) {
      return allScopes;
    }
    const searchLower = searchTerm.toLowerCase();
    return allScopes.filter(scope => 
      scope.scopeName.toLowerCase().includes(searchLower)
    );
  }, [allScopes, searchTerm]);
  
  // Determine if a scope is selected (by scopeName for backward compatibility)
  const isScopeSelected = (scopeName: string) => {
    return selectedScopes.includes(scopeName);
  };
  
  // Handle scope selection
  const handleScopeToggle = (scopeName: string) => {
    if (!showCheckboxes) return;
    const newSelected = isScopeSelected(scopeName)
      ? selectedScopes.filter((scope) => scope !== scopeName)
      : [...selectedScopes, scopeName];
    onScopeSelectionChange?.(newSelected);
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
        {filteredScopes.length === 0 ? (
          <div className="no-scopes-message">
            {searchTerm ? "No scopes found" : "No scopes available"}
          </div>
        ) : (
          filteredScopes.map((scope) => {
            const isSelected = isScopeSelected(scope.scopeName);
            const isActive = !showCheckboxes && scope.scopeName === (filteredScopes[0]?.scopeName ?? "");
            
            return (
              <div
                key={scope.id}
                className={`scope-item ${isActive ? "active" : ""} ${showCheckboxes ? "with-checkbox" : ""}`}
                onClick={() => handleScopeToggle(scope.scopeName)}
              >
                {showCheckboxes && (
                  <Checkbox
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleScopeToggle(scope.scopeName);
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
                <span className="side-menu-text">{scope.scopeName}</span>
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
      />
    </>
  );
};

export default ScopeSidebar;
