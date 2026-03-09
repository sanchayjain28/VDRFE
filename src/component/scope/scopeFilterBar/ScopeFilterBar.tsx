import "./ScopeFilterBar.scss";

const ScopeFilterBar = ({ isScopePage }: { isScopePage?: boolean }) => {
  return (
    <div className={`filter-bar ${isScopePage ? "scope-page" : ""}`}>
      <div className="filter-left">
        {/* Search and Filter temporarily hidden — not functional yet */}
        {/* <Input
          placeholder="Search..."
          prefix={<i className="erm-icon search-icon" />}
          className="quick-search"
        />
        <button type="button" className="status-trigger" aria-label="Filter by status">
          <i className="erm-icon filter-icon"></i>
          Filter
        </button> */}
      </div>

      {!isScopePage && (
        <div className="filter-right">
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
  );
};

export default ScopeFilterBar;
