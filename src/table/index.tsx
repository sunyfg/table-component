import React, { useMemo } from 'react';
import classNames from 'classnames';
import { prefixCls } from '../utils/common';
import useTableSort from '../hooks/useTableSort';
import Header from './Head';
import Pagination, { PaginationProps } from './Pagination';
import TableBody from './Body';

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

  const { sortedData, sortedColumn, sortDirection, handleSort } =
    useTableSort<T>({
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

  const renderCols = (columns: ColumnType<T>[]) => {
    const total: number = columns.length;
    const totalWidth: number = scroll?.x as number;
    const leftWidth: number = leftColumns.reduce(
      (acc, cur) => acc + (cur.width || 0),
      0
    );
    const rightWidth: number = rightColumns.reduce(
      (acc, cur) => acc + (cur.width || 0),
      0
    );
    const middleWidth: number = totalWidth - leftWidth - rightWidth;
    const middleColWidth: number =
      middleWidth / (total - leftColumns.length - rightColumns.length);
    return columns.map((column: ColumnType<T>, index: number) => {
      const width: number | undefined = column.width || middleColWidth;
      return <col key={index} style={{ width: width, minWidth: width }} />;
    });
  };

  return (
    <div className={`${prefixCls}-container-pagenation`}>
      <div
        className={classNames(`${prefixCls}-container`, {
          [`${prefixCls}-container-sticky`]: sticky,
        })}
      >
        {/* 表头 */}
        <div
          className={classNames(`${prefixCls}-container-header`, {
            [`${prefixCls}-head-sticky`]: sticky,
          })}
        >
          <table className={prefixCls} style={{ width: scroll?.x || '100%' }}>
            <colgroup>{renderCols(columns)}</colgroup>
            <Header
              leftColumns={leftColumns}
              columns={middleColumns}
              rightColumns={rightColumns}
              onSort={handleSort}
              sticky={sticky}
              sortedColumn={sortedColumn}
              sortDirection={sortDirection}
            />
          </table>
        </div>
        <div
          className={`${prefixCls}-container-body`}
          style={{ maxHeight: scroll?.y || 'auto' }}
        >
          <table className={prefixCls} style={{ width: scroll?.x || '100%' }}>
            <colgroup>{renderCols(columns)}</colgroup>
            <TableBody
              columns={columns}
              leftColumns={leftColumns}
              middleColumns={middleColumns}
              rightColumns={rightColumns}
              sortedData={sortedData}
              rowKey={rowKey}
              pagenation={pagenation}
            />
          </table>
        </div>
      </div>
      {/* 分页 */}
      {pagenation && <Pagination {...pagenation}></Pagination>}
    </div>
  );
}

export default Table;
