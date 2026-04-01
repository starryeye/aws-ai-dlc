import type { TableData } from '@shared/types';
import TableCard from './TableCard';

interface TableCardGridProps {
  tables: TableData[];
  highlightedOrderIds: Set<number>;
  onTableClick: (tableData: TableData) => void;
}

export default function TableCardGrid({ tables, highlightedOrderIds, onTableClick }: TableCardGridProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      data-testid="table-card-grid"
    >
      {tables.map((table) => {
        const hasHighlight = table.orders.some((o) => highlightedOrderIds.has(o.id));
        return (
          <TableCard
            key={table.tableId}
            table={table}
            isHighlighted={hasHighlight}
            onClick={() => onTableClick(table)}
          />
        );
      })}
    </div>
  );
}
