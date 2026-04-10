import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ContractorSheet } from '@/components/contractors/contractor-sheet';
import { ContractorsTable } from '@/components/contractors/contractors-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useContractorSheet } from '@/hooks/use-contractor-sheet';
import { useTableFilters } from '@/hooks/use-table-filters';
import { index, update as updateContractor } from '@/routes/admin/contractors';
import type {
    ContractorFilters,
    ContractorRow,
    LaravelPaginator,
} from '@/types';

type Props = {
    contractors: LaravelPaginator<ContractorRow>;
    filters: Partial<ContractorFilters> & {
        search_name: string | null;
        search_cnpj: string | null;
        status: string | null;
    };
};

export default function ContractorsIndex({
    contractors,
    filters: initialFilters,
}: Props) {
    const [updatingContractorId, setUpdatingContractorId] = useState<
        number | null
    >(null);
    const {
        sheetOpen,
        setSheetOpen,
        sheetMode,
        setSheetMode,
        selectedContractor,
        setSelectedContractor,
        handleCreate,
        handleView,
        handleEdit,
    } = useContractorSheet();
    const serverHasActiveFilters =
        (initialFilters.search_name ?? '') !== '' ||
        (initialFilters.search_cnpj ?? '') !== '' ||
        (initialFilters.status ?? '') !== '';

    const { filters, handleFilterChange, handleSortChange } =
        useTableFilters<ContractorFilters>({
            initialFilters: {
                search_name: initialFilters.search_name ?? '',
                search_cnpj: initialFilters.search_cnpj ?? '',
                status: initialFilters.status ?? '',
                sort: initialFilters.sort ?? 'name',
                direction: initialFilters.direction ?? 'asc',
            },
            url: index.url(),
        });

    const handleStatusToggle = (contractor: ContractorRow) => {
        setUpdatingContractorId(contractor.id);

        router.patch(
            updateContractor(contractor.id),
            {
                name: contractor.name,
                cnpj: contractor.cnpj ?? '',
                active: !contractor.active,
            },
            {
                only: ['contractors', 'filters'],
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    setUpdatingContractorId(null);
                },
            },
        );
    };

    return (
        <>
            <Head title="Contratantes" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title="Contratantes"
                        description="Gerencie as contratantes vinculadas ao ambiente administrativo."
                    />

                    <Button onClick={handleCreate}>
                        <Plus />
                        Nova contratante
                    </Button>
                </div>

                <ContractorsTable
                    contractors={contractors}
                    filters={filters}
                    serverHasActiveFilters={serverHasActiveFilters}
                    updatingContractorId={updatingContractorId}
                    onCreate={handleCreate}
                    onView={handleView}
                    onEdit={handleEdit}
                    onStatusToggle={handleStatusToggle}
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                />
            </div>

            <ContractorSheet
                open={sheetOpen}
                onOpenChange={(open) => {
                    setSheetOpen(open);

                    if (!open) {
                        setSelectedContractor(null);
                    }
                }}
                mode={sheetMode}
                contractor={selectedContractor}
                onEdit={handleEdit}
                onSuccess={() => {
                    setSheetOpen(false);
                    setSelectedContractor(null);
                    setSheetMode('create');
                }}
            />
        </>
    );
}

ContractorsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Contratantes',
            href: index(),
        },
    ],
};
