import { useState } from 'react';
import type { HealthUnitRow, SheetMode } from '@/types';

export function useHealthUnitSheet() {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [sheetMode, setSheetMode] = useState<SheetMode>('create');
    const [selectedHealthUnit, setSelectedHealthUnit] =
        useState<HealthUnitRow | null>(null);

    const handleCreate = (): void => {
        setSheetMode('create');
        setSelectedHealthUnit(null);
        setSheetOpen(true);
    };

    const handleView = (unit: HealthUnitRow): void => {
        setSheetMode('view');
        setSelectedHealthUnit(unit);
        setSheetOpen(true);
    };

    const handleEdit = (unit: HealthUnitRow): void => {
        setSheetMode('edit');
        setSelectedHealthUnit(unit);
        setSheetOpen(true);
    };

    return {
        sheetOpen,
        setSheetOpen,
        sheetMode,
        setSheetMode,
        selectedHealthUnit,
        setSelectedHealthUnit,
        handleCreate,
        handleView,
        handleEdit,
    };
}
