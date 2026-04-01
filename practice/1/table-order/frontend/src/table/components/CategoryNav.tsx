import type { Category } from '../types';

interface CategoryNavProps {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export default function CategoryNav({
  categories,
  selectedId,
  onSelect,
}: CategoryNavProps) {
  return (
    <nav
      data-testid="category-nav"
      className="flex gap-2 overflow-x-auto border-b bg-white px-4 py-2"
    >
      <button
        data-testid="category-nav-all"
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
          selectedId === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700'
        }`}
        style={{ minHeight: '44px' }}
      >
        전체
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          data-testid={`category-nav-${cat.id}`}
          onClick={() => onSelect(cat.id)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
            selectedId === cat.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
          style={{ minHeight: '44px' }}
        >
          {cat.name}
        </button>
      ))}
    </nav>
  );
}
