import { useState, useMemo } from 'react';
import { ColumnType } from 'src/table';

export interface SortOptions<T> {
  dataSource: T[];
  columns: ColumnType<T>[]; // 列配置
  sortByKey: keyof T | null;
  sortOrder: 'asc' | 'desc';
  onSortChange?: (sortedColumn: keyof T, direction: 'asc' | 'desc') => void;
}

function useTableSort<T>({
  dataSource,
  sortByKey,
  sortOrder = 'asc',
  onSortChange,
}: SortOptions<T>) {
  // 排序逻辑
  const [sortedColumn, setSortedColumn] = useState<keyof T | null>(sortByKey);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(sortOrder);

  const sortedData = useMemo(() => {
    if (!sortedColumn) return dataSource;

    // 根据排序列和排序方向对数据进行排序
    return [...dataSource].sort((a, b) => {
      if (a[sortedColumn] < b[sortedColumn])
        return sortDirection === 'asc' ? -1 : 1;
      if (a[sortedColumn] > b[sortedColumn])
        return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [dataSource, sortedColumn, sortDirection]);

  const handleSort = (column: keyof T) => {
    if (column === sortedColumn) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
      if (sortDirection === 'asc') {
        // 2.设置排序方向为降序
        setSortDirection('desc');
      } else {
        // 3.清除排序
        setSortedColumn(null);
        setSortDirection('asc');
      }
    } else {
      // 1.设置排序列和排序方向
      setSortedColumn(column);
      // 设置排序方向为升序
      setSortDirection('asc');
    }
    if (typeof onSortChange === 'function') {
      onSortChange(column, sortDirection);
    }
  };

  return {
    sortedData,
    handleSort,
    sortedColumn,
    sortDirection,
  };
}

export default useTableSort;
