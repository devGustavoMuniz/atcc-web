import { useState } from 'react';
import type { ContractorRow, SheetMode } from '@/types';

export function useContractorSheet() {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [sheetMode, setSheetMode] = useState<SheetMode>('create');
    const [selectedContractor, setSelectedContractor] =
        useState<ContractorRow | null>(null);

    const handleCreate = (): void => {
        setSheetMode('create');
        setSelectedContractor(null);
        setSheetOpen(true);
    };

    const handleView = (contractor: ContractorRow): void => {
        setSheetMode('view');
        setSelectedContractor(contractor);
        setSheetOpen(true);
    };

    const handleEdit = (contractor: ContractorRow): void => {
        setSheetMode('edit');
        setSelectedContractor(contractor);
        setSheetOpen(true);
    };

    return {
        sheetOpen,
        setSheetOpen,
        sheetMode,
        setSheetMode,
        selectedContractor,
        setSelectedContractor,
        handleCreate,
        handleView,
        handleEdit,
    };
}
