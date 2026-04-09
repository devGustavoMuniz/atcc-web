import { useState } from 'react';
import type { ManagerRow, SheetMode } from '@/types';

export function useManagerSheet() {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [sheetMode, setSheetMode] = useState<SheetMode>('create');
    const [selectedManager, setSelectedManager] = useState<ManagerRow | null>(
        null,
    );

    const handleCreate = (): void => {
        setSheetMode('create');
        setSelectedManager(null);
        setSheetOpen(true);
    };

    const handleView = (manager: ManagerRow): void => {
        setSheetMode('view');
        setSelectedManager(manager);
        setSheetOpen(true);
    };

    const handleEdit = (manager: ManagerRow): void => {
        setSheetMode('edit');
        setSelectedManager(manager);
        setSheetOpen(true);
    };

    return {
        sheetOpen,
        setSheetOpen,
        sheetMode,
        setSheetMode,
        selectedManager,
        setSelectedManager,
        handleCreate,
        handleView,
        handleEdit,
    };
}
