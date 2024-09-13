import React, { useMemo } from 'react';
import { prefixCls } from '../utils/common';
import { PaginationProps } from './Pagination';
import { ColumnType } from '.';
import Cell from './Cell';

interface TableBodyProps<T> {
  columns: ColumnType<T>[];
  leftColumns: ColumnType<T>[];
  middleColumns: ColumnType<T>[];
  rightColumns: ColumnType<T>[];
  sortedData: T[];
  rowKey?: string | ((record: T, index: number) => string); // 行标识
  pagenation?: PaginationProps;
}

function TableBody<T>(props: TableBodyProps<T>) {
  const {
    columns,
    leftColumns,
    middleColumns,
    rightColumns,
    sortedData,
    rowKey,
    pagenation,
  } = props;
  // 渲染表格内容
  const renderRows = useMemo(() => {
    const { current, pageSize } = pagenation || { current: 1, pageSize: 10 };
    return sortedData
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
                  key={column.key as string}
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
                  key={column.key as string}
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
                  key={column.key as string}
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
  return <tbody className={`${prefixCls}-body`}>{renderRows}</tbody>;
}

export default TableBody;
