import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { getCategories, getMenuItems } from '../services/menu';
import CategoryNav from '../components/CategoryNav';
import MenuCard from '../components/MenuCard';
import type { Category, MenuItem } from '../types';

export default function MenuPage() {
  const { credentials } = useAuth();
  const { addItem } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!credentials) return;
      try {
        const [cats, items] = await Promise.all([
          getCategories(credentials.storeId),
          getMenuItems(credentials.storeId),
        ]);
        setCategories(cats);
        setMenuItems(items);
      } catch {
        // 에러 시 빈 상태 유지
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [credentials]);

  const filteredItems = selectedCategoryId
    ? menuItems.filter((item) => item.categoryId === selectedCategoryId)
    : menuItems;

  if (isLoading) {
    return (
      <div data-testid="menu-page-skeleton" className="p-4">
        <div className="mb-4 flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 w-20 animate-pulse rounded-full bg-gray-200"
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div data-testid="menu-page">
      <CategoryNav
        categories={categories}
        selectedId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />
      <div className="grid grid-cols-2 gap-4 p-4">
        {filteredItems.map((item) => (
          <MenuCard key={item.id} item={item} onAdd={addItem} />
        ))}
      </div>
      {filteredItems.length === 0 && (
        <p className="py-8 text-center text-gray-500">
          해당 카테고리에 메뉴가 없습니다
        </p>
      )}
    </div>
  );
}
