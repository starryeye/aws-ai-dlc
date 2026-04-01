interface DateFilterProps {
  dateFrom: string;
  dateTo: string;
  onChange: (dateFrom: string, dateTo: string) => void;
}

export default function DateFilter({ dateFrom, dateTo, onChange }: DateFilterProps) {
  return (
    <div className="flex items-center gap-2" data-testid="date-filter">
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => onChange(e.target.value, dateTo)}
        data-testid="date-from"
        className="border border-gray-300 rounded px-2 py-1 text-sm"
      />
      <span className="text-gray-500">~</span>
      <input
        type="date"
        value={dateTo}
        onChange={(e) => onChange(dateFrom, e.target.value)}
        data-testid="date-to"
        className="border border-gray-300 rounded px-2 py-1 text-sm"
      />
    </div>
  );
}
