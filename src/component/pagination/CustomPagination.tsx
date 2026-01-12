import { Pagination } from "antd";
import "./CustomPagination.scss";

interface ICustomPagination {
  currentPage: number;
  total: number;
  handlePagination: (page: number) => void;
  pageSize: number;
  isHidePagination?: boolean;
}

const CustomPagination = ({
  currentPage,
  total,
  handlePagination,
  pageSize,
  isHidePagination = false,
}: ICustomPagination) => {
  const getPaginationText = (page: number, pageSize: number, total: number) => {
    if (page === 0) page = 1;
    if (total === 0) return "Showing 0 of 0";
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    return `Showing ${start} to ${end} of ${total}`;
  };

  return (
    <div className="pagination-section">
      <p className="table-entries">{getPaginationText(currentPage, pageSize, total)}</p>

      {!isHidePagination && (
        <Pagination
          current={currentPage}
          total={total}
          onChange={handlePagination}
          pageSize={pageSize}
          showSizeChanger={false}
        />
      )}
    </div>
  );
};

export default CustomPagination;
