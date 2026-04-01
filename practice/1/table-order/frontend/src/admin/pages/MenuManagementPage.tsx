import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { MenuProvider, useMenu } from '../contexts/MenuContext';
import { menuApi } from '../services/menuApi';
import CategoryTabs from '../components/CategoryTabs';
import MenuFormModal from '../components/MenuFormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Spinner from '../components/Spinner';
import type { MenuItem, MenuItemRequest } from '@shared/types';

function MenuContent() {
  const { state: authState } = useAuth();
  const { state, dispatch } = useMenu();
  const storeId = authState.storeId!;
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; itemId: number | null }>({ isOpen: false, itemId: null });

  const loadData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [categories, menus] = await Promise.all([
        menuApi.getCategories(storeId),
        menuApi.getMenuItems(storeId),
      ]);
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
      dispatch({ type: 'SET_MENU_ITEMS', payload: menus });
    } catch {
      toast.error('메뉴 데이터를 불러오는데 실패했습니다');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [storeId, dispatch]);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredItems = selectedCategory
    ? state.menuItems.filter((m) => m.categoryId === selectedCategory)
    : state.menuItems;

  const handleSubmit = async (data: MenuItemRequest) => {
    setFormLoading(true);
    try {
      if (editingItem) {
        const updated = await menuApi.updateMenuItem(storeId, editingItem.id, data);
        dispatch({ type: 'UPDATE_MENU_ITEM', payload: updated });
        toast.success('메뉴가 수정되었습니다');
      } else {
        const created = await menuApi.createMenuItem(storeId, data);
        dispatch({ type: 'ADD_MENU_ITEM', payload: created });
        toast.success('메뉴가 등록되었습니다');
      }
      setShowForm(false);
      setEditingItem(null);
    } catch {
      toast.error(editingItem ? '메뉴 수정에 실패했습니다' : '메뉴 등록에 실패했습니다');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.itemId) return;
    try {
      await menuApi.deleteMenuItem(storeId, deleteConfirm.itemId);
      dispatch({ type: 'REMOVE_MENU_ITEM', payload: deleteConfirm.itemId });
      toast.success('메뉴가 삭제되었습니다');
    } catch {
      toast.error('메뉴 삭제에 실패했습니다');
    } finally {
      setDeleteConfirm({ isOpen: false, itemId: null });
    }
  };

  const handleMoveOrder = async (item: MenuItem, direction: 'up' | 'down') => {
    const sorted = [...filteredItems].sort((a, b) => a.displayOrder - b.displayOrder);
    const idx = sorted.findIndex((m) => m.id === item.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const updates = [
      { menuId: sorted[idx].id, displayOrder: sorted[swapIdx].displayOrder },
      { menuId: sorted[swapIdx].id, displayOrder: sorted[idx].displayOrder },
    ];
    try {
      await menuApi.updateMenuOrder(storeId, updates);
      loadData();
    } catch {
      toast.error('순서 변경에 실패했습니다');
    }
  };

  if (state.isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

  return (
    <div data-testid="menu-management-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">메뉴 관리</h1>
        <button
          onClick={() => { setEditingItem(null); setShowForm(true); }}
          data-testid="add-menu-button"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          메뉴 등록
        </button>
      </div>
      <CategoryTabs categories={state.categories} selectedId={selectedCategory} onSelect={setSelectedCategory} />
      {filteredItems.length === 0 ? (
        <p className="text-gray-500 text-center py-12">등록된 메뉴가 없습니다</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3">순서</th>
                <th className="text-left px-4 py-3">메뉴명</th>
                <th className="text-left px-4 py-3">카테고리</th>
                <th className="text-right px-4 py-3">가격</th>
                <th className="text-center px-4 py-3">관리</th>
              </tr>
            </thead>
            <tbody>
              {[...filteredItems].sort((a, b) => a.displayOrder - b.displayOrder).map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50" data-testid={`menu-row-${item.id}`}>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => handleMoveOrder(item, 'up')} className="text-gray-400 hover:text-gray-600" data-testid={`move-up-${item.id}`}>▲</button>
                      <button onClick={() => handleMoveOrder(item, 'down')} className="text-gray-400 hover:text-gray-600" data-testid={`move-down-${item.id}`}>▼</button>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-gray-600">{item.categoryName}</td>
                  <td className="px-4 py-3 text-right">{item.price.toLocaleString()}원</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => { setEditingItem(item); setShowForm(true); }} data-testid={`edit-menu-${item.id}`} className="text-blue-600 hover:text-blue-800 mr-3">수정</button>
                    <button onClick={() => setDeleteConfirm({ isOpen: true, itemId: item.id })} data-testid={`delete-menu-${item.id}`} className="text-red-600 hover:text-red-800">삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <MenuFormModal isOpen={showForm} editingItem={editingItem} categories={state.categories} onSubmit={handleSubmit} onClose={() => { setShowForm(false); setEditingItem(null); }} isLoading={formLoading} />
      <ConfirmDialog isOpen={deleteConfirm.isOpen} title="메뉴 삭제" message="이 메뉴를 삭제하시겠습니까?" confirmLabel="삭제" onConfirm={handleDelete} onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null })} />
    </div>
  );
}

export default function MenuManagementPage() {
  return (
    <MenuProvider>
      <MenuContent />
    </MenuProvider>
  );
}
