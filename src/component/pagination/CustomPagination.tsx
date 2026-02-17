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
  const getPaginationText = (page: number, pageSize: number, total: number): string => {
    if (total === 0 || pageSize === 0) {
      return "Showing 0 of 0";
    }
    const currentPage = Math.max(page, 1);
    const totalPages = Math.ceil(total / pageSize);
    return `Showing ${currentPage} of ${totalPages}`;
  };

  return (
    <div className="pagination-section" hidden={isHidePagination}>
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
