import type { MenuItem } from '../types';
import { formatCurrency } from '../utils/format';

interface MenuCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export default function MenuCard({ item, onAdd }: MenuCardProps) {
  return (
    <div
      data-testid={`menu-card-${item.id}`}
      className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm"
    >
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          className="h-36 w-full object-cover"
        />
      ) : (
        <div className="flex h-36 items-center justify-center bg-gray-100 text-4xl">
          🍽️
        </div>
      )}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-medium">{item.name}</h3>
        {item.description && (
          <p className="mt-1 text-sm text-gray-500">{item.description}</p>
        )}
        <p className="mt-auto pt-2 text-lg font-bold text-blue-600">
          {formatCurrency(item.price)}
        </p>
        <button
          data-testid={`menu-card-add-${item.id}`}
          onClick={() => onAdd(item)}
          className="mt-2 rounded bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
          style={{ minHeight: '44px' }}
        >
          담기
        </button>
      </div>
    </div>
  );
}
