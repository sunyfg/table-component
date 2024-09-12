import React from 'react';

export interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  onPageSizeChange?: (page: number, size: number) => void;
}

const PaginationItem = ({
  key,
  index,
  active,
  className,
  onClick,
  children,
}: {
  key?: string;
  className?: string;
  index?: number;
  active?: boolean;
  onClick?: (index?: number) => void;
  children?: React.ReactNode;
}) => (
  <li
    key={key}
    className={`pagination-item ${active ? 'active' : ''} ${className}`}
    onClick={() => onClick?.(index)}
  >
    {children || index}
  </li>
);

const Pagination = ({
  current,
  total,
  pageSize,
  onChange,
  onPageSizeChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(total / pageSize);
  const pages = [];
  // 计算显示的页码范围
  let startPage, endPage;
  const padding = 2; // 前后各显示的页码数（不包括当前页）
  const offset = Math.floor(padding / 2);

  if (totalPages <= 7) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (current <= padding + 1) {
      startPage = 1;
      endPage = 2 * padding + 1;
    } else if (current >= totalPages - padding) {
      startPage = totalPages - 2 * padding;
      endPage = totalPages;
    } else {
      startPage = current - offset;
      endPage = current + offset;
    }
  }

  if (startPage > 1) {
    // 在开始页码前添加省略号（如果不是第一页）
    pages.push(
      <PaginationItem
        key={`1`}
        className={`page-item ${1 === current ? 'active' : ''}`}
        onClick={() => onChange(1)}
      >
        {1}
      </PaginationItem>
    );
    if (current > padding + 1) {
      pages.push(
        <PaginationItem key={`ellipsis-start`} className="ellipsis">
          ...
        </PaginationItem>
      );
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <PaginationItem
        key={`${i}`}
        className={`page-item ${i === current ? 'active' : ''}`}
        onClick={() => onChange(i)}
      >
        {i}
      </PaginationItem>
    );
  }

  if (endPage < totalPages) {
    pages.push(
      <PaginationItem key={`ellipsis-end`} className="ellipsis">
        ...
      </PaginationItem>
    );
    // 在开始页码前添加省略号（如果不是第一页）
    pages.push(
      <PaginationItem
        key={`${totalPages}`}
        className={`page-item ${totalPages === current ? 'active' : ''}`}
        onClick={() => onChange(totalPages)}
      >
        {totalPages}
      </PaginationItem>
    );
  }

  pages.unshift(
    <PaginationItem
      className={`prev`}
      onClick={() => {
        if (current > 1) {
          onChange(current - 1);
        }
      }}
    >
      上一页
    </PaginationItem>
  );

  pages.push(
    <PaginationItem
      className={`prev`}
      onClick={() => {
        if (current < totalPages) {
          onChange(current + 1);
        }
      }}
    >
      下一页
    </PaginationItem>
  );

  return (
    <div className="pagination-container">
      <div className="pagination-total">共 {total} 条</div>
      {/* 每页显示 */}
      <div className="pagination-page-size">
        每页显示
        <select
          className="pagination-page-size-select"
          value={pageSize}
          onChange={e => {
            const pageSize = parseInt(e.target.value, 10);
            const totalPages = Math.ceil(total / pageSize);
            if (current > totalPages) {
              current = totalPages;
            }
            onPageSizeChange?.(current, pageSize);
          }}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
        条
      </div>
      <ul className="pagination">
        {/* 可以在这里添加上一页和下一页的逻辑 */}
        {pages}
      </ul>
    </div>
  );
};

export default Pagination;
