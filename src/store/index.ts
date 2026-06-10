import { create } from 'zustand';
import { PaginationState } from '../types';

interface SidebarState {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  closeSidebar: () => set({ isOpen: false }),
}));

interface UiState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));

interface PaginationStore extends PaginationState {
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setPaginationState: (state: PaginationState) => void;
}

export const usePaginationStore = create<PaginationStore>((set) => ({
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
  setPaginationState: (state) => set(state),
}));

interface NotificationState {
  message: string | null;
  type: 'success' | 'error' | 'warning' | 'info';
  show: boolean;
  showNotification: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  hideNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  message: null,
  type: 'info',
  show: false,
  showNotification: (message, type) => set({ message, type, show: true }),
  hideNotification: () => set({ show: false }),
}));

interface ModalState {
  isOpen: boolean;
  data?: unknown;
  openModal: (data?: unknown) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  data: undefined,
  openModal: (data) => set({ isOpen: true, data }),
  closeModal: () => set({ isOpen: false, data: undefined }),
}));
