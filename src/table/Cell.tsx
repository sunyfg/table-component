import React from 'react';
import { prefixCls } from '../utils/common';
import { ColumnType } from './index';

interface CellProps<T> {
  key: keyof T;
  column: ColumnType<T>;
  record: T;
  rowIndex: number;
  colIndex: number;
  className?: string;
  styles?: React.CSSProperties;
}

// 列
function Cell<T>(props: CellProps<T>) {
  const { column, record, rowIndex, className, styles = {} } = props;

  const text = column.dataIndex ? record[column.dataIndex] : '';
  const cell = column.render ? column.render(text, record, rowIndex) : text;

  if (column.width) {
    styles.width = column.width;
  }

  return (
    <td
      className={`${prefixCls}-body-cell ${column.fixed ? `${prefixCls}-body-cell-${column.fixed}` : ''} ${className || ''}`}
      key={column.key as string}
      style={styles}
    >
      {cell}
    </td>
  );
}

export default Cell;
