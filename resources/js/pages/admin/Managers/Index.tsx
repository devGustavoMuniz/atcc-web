import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ManagerSheet } from '@/components/managers/manager-sheet';
import { ManagersTable } from '@/components/managers/managers-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useManagerSheet } from '@/hooks/use-manager-sheet';
import { useTableFilters } from '@/hooks/use-table-filters';
import { index, update as updateManager } from '@/routes/admin/managers';
import type { ContractorOption, LaravelPaginator, ManagerFilters, ManagerRow } from '@/types';

type Props = {
    managers: LaravelPaginator<ManagerRow>;
    filters: Partial<ManagerFilters> & {
        search_name: string | null;
        search_email: string | null;
        contractor_id: string | null;
        status: string | null;
    };
    contractors: ContractorOption[];
};

export default function ManagersIndex({ managers, filters: initialFilters, contractors }: Props) {
    const [updatingManagerId, setUpdatingManagerId] = useState<number | null>(null);
    const { sheetOpen, setSheetOpen, sheetMode, setSheetMode, selectedManager, setSelectedManager, handleCreate, handleView, handleEdit } = useManagerSheet();
    const { filters, handleFilterChange, handleSortChange } = useTableFilters<ManagerFilters>({
        initialFilters: { search_name: initialFilters.search_name ?? '', search_email: initialFilters.search_email ?? '', contractor_id: initialFilters.contractor_id ?? '', status: initialFilters.status ?? '', sort: initialFilters.sort ?? 'name', direction: initialFilters.direction ?? 'asc' },
        url: index.url(),
    });

    const handleStatusToggle = (manager: ManagerRow) => {
        setUpdatingManagerId(manager.id);
        router.patch(updateManager(manager.id), { name: manager.name, email: manager.email, contractor_id: String(manager.manager_profile?.contractor?.id ?? ''), password: '', active: !manager.active }, {
            only: ['managers', 'filters'],
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setUpdatingManagerId(null),
        });
    };

    return <>
        <Head title="Gestores" />
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <Heading title="Gestores" description="Gerencie os gestores vinculados ao ambiente administrativo." />
                <Button onClick={handleCreate}><Plus />Novo gestor</Button>
            </div>
            <ManagersTable managers={managers} filters={filters} contractors={contractors} updatingManagerId={updatingManagerId} onCreate={handleCreate} onView={handleView} onEdit={handleEdit} onStatusToggle={handleStatusToggle} onFilterChange={handleFilterChange} onSortChange={handleSortChange} />
        </div>
        <ManagerSheet open={sheetOpen} onOpenChange={(open) => { setSheetOpen(open); if (!open) { setSelectedManager(null); } }} mode={sheetMode} manager={selectedManager} contractors={contractors} onEdit={handleEdit} onSuccess={() => { setSheetOpen(false); setSelectedManager(null); setSheetMode('create'); }} />
    </>;
}

ManagersIndex.layout = {
    breadcrumbs: [{ title: 'Gestores', href: index() }],
};
