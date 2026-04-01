import { useState, useEffect, type FormEvent } from 'react';
import type { MenuItem, MenuItemRequest, Category } from '@shared/types';
import Spinner from './Spinner';

interface MenuFormModalProps {
  isOpen: boolean;
  editingItem: MenuItem | null;
  categories: Category[];
  onSubmit: (data: MenuItemRequest) => void;
  onClose: () => void;
  isLoading?: boolean;
}

interface FormErrors {
  name?: string;
  price?: string;
  categoryId?: string;
  description?: string;
  imageUrl?: string;
}

export function validateMenuForm(data: MenuItemRequest): FormErrors {
  const errors: FormErrors = {};
  if (!data.name || data.name.trim().length === 0) errors.name = '메뉴명을 입력해주세요';
  else if (data.name.length > 50) errors.name = '50자 이내로 입력해주세요';
  if (data.price === undefined || data.price < 0) errors.price = '0 이상의 값을 입력해주세요';
  if (!data.categoryId) errors.categoryId = '카테고리를 선택해주세요';
  if (data.description && data.description.length > 200) errors.description = '200자 이내로 입력해주세요';
  if (data.imageUrl && !/^https?:\/\/.+/.test(data.imageUrl)) errors.imageUrl = '올바른 URL 형식을 입력해주세요';
  return errors;
}

export default function MenuFormModal({ isOpen, editingItem, categories, onSubmit, onClose, isLoading }: MenuFormModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setPrice(String(editingItem.price));
      setDescription(editingItem.description || '');
      setCategoryId(String(editingItem.categoryId));
      setImageUrl(editingItem.imageUrl || '');
      setDisplayOrder(String(editingItem.displayOrder));
    } else {
      setName(''); setPrice(''); setDescription(''); setCategoryId(''); setImageUrl(''); setDisplayOrder('0');
    }
    setErrors({});
  }, [editingItem, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data: MenuItemRequest = {
      name: name.trim(),
      price: Number(price),
      description: description.trim() || undefined,
      categoryId: Number(categoryId),
      imageUrl: imageUrl.trim() || undefined,
      displayOrder: Number(displayOrder),
    };
    const formErrors = validateMenuForm(data);
    if (Object.keys(formErrors).length > 0) { setErrors(formErrors); return; }
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="menu-form-modal">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">{editingItem ? '메뉴 수정' : '메뉴 등록'}</h2>
          <button onClick={onClose} data-testid="menu-form-close" className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3" data-testid="menu-form">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">메뉴명 *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} data-testid="menu-name" className="w-full px-3 py-2 border rounded-md" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">가격 *</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} data-testid="menu-price" className="w-full px-3 py-2 border rounded-md" />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 *</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} data-testid="menu-category" className="w-full px-3 py-2 border rounded-md">
              <option value="">선택하세요</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} data-testid="menu-description" className="w-full px-3 py-2 border rounded-md" rows={2} />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이미지 URL</label>
            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} data-testid="menu-image-url" className="w-full px-3 py-2 border rounded-md" />
            {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">노출 순서</label>
            <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} data-testid="menu-display-order" className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">취소</button>
            <button type="submit" disabled={isLoading} data-testid="menu-form-submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2">
              {isLoading ? <Spinner size="sm" /> : null}
              {editingItem ? '수정' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
