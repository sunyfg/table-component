import React, { useMemo } from 'react';
import { prefixCls } from '../utils/common';
import useTableSort from '../hooks/useTableSort';
import Header from './Head';
import Cell from './Cell';
import Pagination, { PaginationProps } from './Pagination';

// 列类型定义
export interface ColumnType<T> {
  key: keyof T;
  title: string; // 列标题
  dataIndex?: keyof T; // 数据索引
  sortable?: boolean;
  fixed?: 'left' | 'right';
  width?: number; // 列宽度
  onSort?: (a: T, b: T) => number; // 排序变化回调
  render?: (text: unknown, record: T, index: number) => React.ReactNode; // 自定义渲染函数
}

// 表格类型定义
export interface TableProps<T> {
  columns: ColumnType<T>[]; // 列配置
  dataSource: T[]; // 数据源
  rowKey?: string | ((record: T, index: number) => string); // 行标识
  sticky?: boolean; // 是否固定表头
  scroll: { x?: number | string; y?: number | string }; // 滚动配置
  // 分页配置
  pagenation?: PaginationProps;
  onSortChange?: (sortedColumn: keyof T, direction: 'asc' | 'desc') => void;
}

// 表格组件
function Table<T>(props: TableProps<T>) {
  const {
    columns,
    dataSource,
    rowKey = 'id',
    sticky,
    scroll,
    pagenation,
  } = props;

  const [sortedData, handleSort] = useTableSort<T>({
    dataSource: dataSource,
    columns,
    sortByKey: null,
    sortOrder: 'asc',
  });

  const leftColumns = useMemo(
    () => columns.filter(c => c.fixed === 'left'),
    [columns]
  );
  const middleColumns = useMemo(() => columns.filter(c => !c.fixed), [columns]);
  const rightColumns = useMemo(
    () => columns.filter(c => c.fixed === 'right'),
    [columns]
  );

  // 渲染表格内容
  const renderRows = useMemo(() => {
    const { current, pageSize } = pagenation || { current: 1, pageSize: 10 };
    return (sortedData as T[])
      ?.slice((current - 1) * pageSize, current * pageSize)
      .map((record, rowIndex) => {
        let leftWidth = 0;
        let rightWidth = rightColumns.reduce((acc, column) => {
          if (typeof column.width === 'number') {
            acc += column.width;
          }
          return acc;
        }, 0);

        return (
          <tr
            key={
              typeof rowKey === 'function' ? rowKey(record, rowIndex) : rowIndex
            }
          >
            {leftColumns?.map((column, index) => {
              let left = 0;
              if (index > 0) {
                left = leftWidth;
              }
              if (typeof column.width === 'number') {
                leftWidth += column.width;
              }
              return (
                <Cell
                  key={column.key}
                  column={column}
                  record={record}
                  rowIndex={rowIndex}
                  colIndex={index}
                  className={
                    index + 1 === leftColumns.length
                      ? `${prefixCls}-body-cell-left-last`
                      : ''
                  }
                  styles={{ left }}
                ></Cell>
              );
            })}
            {middleColumns?.map((column, index) => {
              return (
                <Cell
                  key={column.key}
                  column={column}
                  record={record}
                  rowIndex={rowIndex}
                  colIndex={index}
                ></Cell>
              );
            })}
            {rightColumns?.map((column, index) => {
              if (typeof column.width === 'number') {
                rightWidth -= column.width;
              }
              return (
                <Cell
                  key={column.key}
                  column={column}
                  record={record}
                  rowIndex={rowIndex}
                  colIndex={index}
                  className={
                    index === 0 ? `${prefixCls}-body-cell-right-first` : ''
                  }
                  styles={{ right: rightWidth }}
                ></Cell>
              );
            })}
          </tr>
        );
      });
  }, [sortedData, columns, rowKey, pagenation]);

  return (
    <div className={`${prefixCls}-container-pagenation`}>
      <div className={`${prefixCls}-container`}>
        <table className={prefixCls} style={{ width: scroll?.x || '100%' }}>
          <Header
            leftColumns={leftColumns}
            columns={middleColumns}
            rightColumns={rightColumns}
            onSort={handleSort as (column: keyof T) => void}
            sticky={sticky}
          />
          <tbody className={`${prefixCls}-body`}>{renderRows}</tbody>
        </table>
      </div>
      {/* 分页 */}
      {pagenation && <Pagination {...pagenation}></Pagination>}
    </div>
  );
}

export default Table;
