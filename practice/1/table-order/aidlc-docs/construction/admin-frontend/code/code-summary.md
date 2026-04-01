# Unit 3: Admin Frontend - Code Generation Summary

## 생성된 파일 목록

### 프로젝트 설정 (7 files)
- `frontend/package.json`
- `frontend/tsconfig.json`
- `frontend/vite.config.ts`
- `frontend/vitest.config.ts`
- `frontend/tailwind.config.js`
- `frontend/postcss.config.js`
- `frontend/index.html`

### 공유 코드 (3 files)
- `frontend/src/shared/types/index.ts` - DTO 타입 정의
- `frontend/src/shared/api/client.ts` - Axios 인스턴스 + 인터셉터
- `frontend/src/shared/auth/authUtils.ts` - 토큰 유틸리티

### 엔트리 포인트 (3 files)
- `frontend/src/main.tsx`
- `frontend/src/App.tsx`
- `frontend/src/index.css`

### 컨텍스트 (3 files)
- `frontend/src/admin/contexts/AuthContext.tsx`
- `frontend/src/admin/contexts/OrderContext.tsx`
- `frontend/src/admin/contexts/MenuContext.tsx`

### 페이지 (4 files)
- `frontend/src/admin/pages/LoginPage.tsx`
- `frontend/src/admin/pages/DashboardPage.tsx`
- `frontend/src/admin/pages/TableManagementPage.tsx`
- `frontend/src/admin/pages/MenuManagementPage.tsx`

### 컴포넌트 (13 files)
- `frontend/src/admin/components/AdminLayout.tsx`
- `frontend/src/admin/components/AdminNavigation.tsx`
- `frontend/src/admin/components/ProtectedRoute.tsx`
- `frontend/src/admin/components/ConnectionStatus.tsx`
- `frontend/src/admin/components/TableCardGrid.tsx`
- `frontend/src/admin/components/TableCard.tsx`
- `frontend/src/admin/components/OrderStatusBadge.tsx`
- `frontend/src/admin/components/StatusDropdown.tsx`
- `frontend/src/admin/components/OrderDetailModal.tsx`
- `frontend/src/admin/components/OrderHistoryModal.tsx`
- `frontend/src/admin/components/DateFilter.tsx`
- `frontend/src/admin/components/MenuFormModal.tsx`
- `frontend/src/admin/components/CategoryTabs.tsx`
- `frontend/src/admin/components/ConfirmDialog.tsx`
- `frontend/src/admin/components/Spinner.tsx`

### 훅 (1 file)
- `frontend/src/admin/hooks/useSse.ts`

### API 서비스 (4 files)
- `frontend/src/admin/services/authApi.ts`
- `frontend/src/admin/services/orderApi.ts`
- `frontend/src/admin/services/tableApi.ts`
- `frontend/src/admin/services/menuApi.ts`

### 테스트 (6 files)
- `frontend/src/admin/__tests__/orderReducer.pbt.test.ts` (PBT)
- `frontend/src/admin/__tests__/menuReducer.pbt.test.ts` (PBT)
- `frontend/src/admin/__tests__/validation.pbt.test.ts` (PBT)
- `frontend/src/admin/__tests__/orderReducer.test.ts` (Example-Based)
- `frontend/src/admin/__tests__/menuReducer.test.ts` (Example-Based)
- `frontend/src/admin/__tests__/authReducer.test.ts` (Example-Based)

### 배포 (3 files)
- `frontend/Dockerfile`
- `frontend/nginx.conf`
- `frontend/src/test-setup.ts`

## 총 파일 수: 47개
