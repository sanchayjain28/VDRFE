import { Input, Button, Progress, Checkbox } from "antd";
import "./ScopeSidebar.scss";
import { useState } from "react";
import { AddScope } from "../../../component";

interface ScopeSidebarProps {
  showCheckboxes?: boolean;
  selectedScopes?: string[];
  onScopeSelectionChange?: (selectedScopes: string[]) => void;
}

const ScopeSidebar = ({ showCheckboxes = false, selectedScopes = [], onScopeSelectionChange }: ScopeSidebarProps) => {
  const [isAddScopeOpen, setIsAddScopeOpen] = useState(false);

  return (
    <>
      <h4 className="sidebar-heading">Scope</h4>
      <div className="sidebar-search-wrapper">
        <Input
          placeholder="Quick find"
          prefix={<i className="erm-icon search-icon" />}
          className="quick-search"
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
        {[
          "Air Quality",
          "Business Ethics",
          "Critical Incident Risk Management",
          "Customer Welfare",
          "Data Security",
          "Ecological Impacts",
          "Employee Engagement, Diversity & inclusion",
          "Employee Health & Safety",
          "Energy Management",
        ].map((item) => {
          const isSelected = selectedScopes.includes(item);
          const isActive = !showCheckboxes && item === "Air Quality";
          
          return (
            <div
              key={item}
              className={`scope-item ${isActive ? "active" : ""} ${showCheckboxes ? "with-checkbox" : ""}`}
              onClick={() => {
                if (!showCheckboxes) return;
                const newSelected = isSelected
                  ? selectedScopes.filter((scope) => scope !== item)
                  : [...selectedScopes, item];
                onScopeSelectionChange?.(newSelected);
              }}
            >
              {showCheckboxes && (
                <Checkbox
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    const newSelected = e.target.checked
                      ? [...selectedScopes, item]
                      : selectedScopes.filter((scope) => scope !== item);
                    onScopeSelectionChange?.(newSelected);
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
              <span className="side-menu-text">{item}</span>
              {!showCheckboxes && (
                <span className="flag-icon-wrap">
                  <i className="erm-icon flag-icon" />
                </span>
              )}
            </div>
          );
        })}
      </div>

      <AddScope
        open={isAddScopeOpen}
        onClose={() => setIsAddScopeOpen(false)}
      />
    </>
  );
};

export default ScopeSidebar;
