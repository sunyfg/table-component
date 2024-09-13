import React from 'react';
import classNames from 'classnames';
import { prefixCls } from '../utils/common';
import { ColumnType } from './index';

interface CellProps<T> {
  key: string;
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
      className={classNames(
        `${prefixCls}-body-cell`,
        { [`${prefixCls}-body-cell-${column.fixed}`]: column.fixed },
        className
      )}
      key={column.key as string}
      style={styles}
    >
      {cell}
    </td>
  );
}

export default Cell;
