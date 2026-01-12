import { useState } from "react";
import { Button, Input } from "antd";
import { SelectedSourcesDrawer } from "../../../component";
import "./ScopeFilterBar.scss";

const ScopeFilterBar = ({ isScopePage }: { isScopePage?: boolean }) => {
  const [isSelectedSourcesOpen, setIsSelectedSourcesOpen] = useState(false);

  const handleOpenSelectedSources = () => {
    setIsSelectedSourcesOpen(true);
  };

  const handleCloseSelectedSources = () => {
    setIsSelectedSourcesOpen(false);
  };

  const handleSelectSources = (selectedItems: any[]) => {
    console.log("Selected Sources:", selectedItems);
  };

  return (
    <>
      <div className={`filter-bar ${isScopePage ? "scope-page" : ""}`}>
        <div className="filter-left">
          <Input
            placeholder="Search..."
            prefix={<i className="erm-icon search-icon" />}
            className="quick-search"
          />
          <button type="button" className="status-trigger" aria-label="Filter by status">
            <i className="erm-icon filter-icon"></i>
            Filter
          </button>

          {/* <Select
            defaultValue="all"
            className="dropdown-ui"
            suffixIcon={
              <>
                <i className="erm-icon dropdown-arrow-icon" />
                <i className="erm-icon dropdown-top-arrow-icon" />
              </>
            }
          >
            <Select.Option value="all">All</Select.Option>
          </Select> */}
        </div>

        {!isScopePage && (
          <div className="filter-right">
            <Button
              icon={<i className="erm-icon refresh-double-icon" />}
              className="primary-btn"
              type="primary"
              shape="round"
              onClick={handleOpenSelectedSources}
            >
              MANAGE SYNC
            </Button>

            {/* <Button
              icon={<i className="erm-icon plus-icon" />}
              className="primary-btn"
              type="primary"
              shape="round"
            >
              CREATE REQUEST
            </Button> */}

          </div>
        )}
      </div>

      <SelectedSourcesDrawer
        open={isSelectedSourcesOpen}
        onClose={handleCloseSelectedSources}
        onSelect={handleSelectSources}
      />
    </>
  );
};

export default ScopeFilterBar;
