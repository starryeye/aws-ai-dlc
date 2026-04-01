import type { Category } from '@shared/types';

interface CategoryTabsProps {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export default function CategoryTabs({ categories, selectedId, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 flex-wrap mb-4" data-testid="category-tabs">
      <button
        onClick={() => onSelect(null)}
        data-testid="category-tab-all"
        className={`px-3 py-1.5 rounded text-sm transition-colors ${
          selectedId === null ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        전체
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          data-testid={`category-tab-${cat.id}`}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            selectedId === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
