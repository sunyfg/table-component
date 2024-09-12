import React from 'react';
import { prefixCls } from '../utils/common';
import { ColumnType } from './index';

interface TableHeaderProps<T> {
  leftColumns: ColumnType<T>[]; // 假设ColumnProps是Column组件的Props类型
  columns: ColumnType<T>[]; // 假设ColumnProps是Column组件的Props类型
  rightColumns: ColumnType<T>[]; // 假设ColumnProps是Column组件的Props类型
  sticky?: boolean; // 是否固定表头
  onSort: (column: keyof T) => void;
}

// 表头组件
function Header<T>({
  leftColumns,
  columns,
  rightColumns,
  sticky,
  onSort,
}: TableHeaderProps<T>) {
  let leftWidth = 0;
  let rightWidth = rightColumns.reduce((acc, column) => {
    if (typeof column.width === 'number') {
      acc += column.width;
    }
    return acc;
  }, 0);
  // 渲染单元格
  const renderCells = (
    column: ColumnType<T>,
    params?: { className?: string; left?: number; right?: number }
  ) => {
    const styles: React.CSSProperties = {};
    if (column.width) {
      styles.width = column.width;
    }
    if (typeof params?.left === 'number') {
      styles.left = params.left;
    }
    if (params?.right) {
      styles.right = params.right;
    }
    const className = `${prefixCls}-head-cell ${column.fixed ? `${prefixCls}-head-cell-${column.fixed}` : ''} ${params?.className || ''}`;
    return (
      <th
        className={className}
        key={column.key as string}
        onClick={() => column.sortable && onSort(column.key)}
        style={styles}
      >
        {column.title}
      </th>
    );
  };

  return (
    <thead
      className={`${prefixCls}-head ${sticky ? `${prefixCls}-head-sticky` : ''}`}
    >
      <tr>
        {leftColumns?.map((column, index) => {
          let className = '';
          let left = 0;
          if (index + 1 === leftColumns.length) {
            className = `${prefixCls}-head-cell-left-last`;
          }
          if (index > 0) {
            left = leftWidth;
          }
          if (typeof column.width === 'number') {
            leftWidth += column.width;
          }
          return renderCells(column, {
            className,
            left: index > 0 ? left : undefined,
          });
        })}
        {columns?.map(column => {
          return renderCells(column);
        })}
        {rightColumns?.map((column, index) => {
          let className = '';
          if (index === 0) {
            className = `${prefixCls}-head-cell-right-first`;
          }
          if (typeof column.width === 'number') {
            rightWidth -= column.width;
          }

          return renderCells(column, { className, right: rightWidth });
        })}
      </tr>
    </thead>
  );
}

export default Header;
