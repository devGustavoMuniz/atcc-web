import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { HealthUnitSheet } from '@/components/health-units/health-unit-sheet';
import { HealthUnitsTable } from '@/components/health-units/health-units-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useHealthUnitSheet } from '@/hooks/use-health-unit-sheet';
import { useTableFilters } from '@/hooks/use-table-filters';
import { index, update as updateHealthUnit } from '@/routes/manager/health-units';
import type {
    ContractorOption,
    HealthUnitFilters,
    HealthUnitRow,
    LaravelPaginator,
} from '@/types';

type Props = {
    health_units: LaravelPaginator<HealthUnitRow>;
    filters: Partial<HealthUnitFilters> & {
        search_name: string | null;
        search_city: string | null;
        search_type: string | null;
        search_complexity: string | null;
        contractor_id: string | null;
        status: string | null;
    };
    contractors: ContractorOption[];
};

export default function HealthUnitsIndex({
    health_units: healthUnits,
    filters: initialFilters,
    contractors,
}: Props) {
    const [updatingHealthUnitId, setUpdatingHealthUnitId] = useState<
        number | null
    >(null);
    const {
        sheetOpen,
        setSheetOpen,
        sheetMode,
        setSheetMode,
        selectedHealthUnit,
        setSelectedHealthUnit,
        handleCreate,
        handleView,
        handleEdit,
    } = useHealthUnitSheet();
    const { filters, handleFilterChange, handleSortChange } =
        useTableFilters<HealthUnitFilters>({
            initialFilters: {
                search_name: initialFilters.search_name ?? '',
                search_city: initialFilters.search_city ?? '',
                search_type: initialFilters.search_type ?? '',
                search_complexity: initialFilters.search_complexity ?? '',
                contractor_id: initialFilters.contractor_id ?? '',
                status: initialFilters.status ?? '',
                sort: initialFilters.sort ?? 'name',
                direction: initialFilters.direction ?? 'asc',
            },
            url: index.url(),
        });

    const handleStatusToggle = (unit: HealthUnitRow): void => {
        setUpdatingHealthUnitId(unit.id);

        router.patch(
            updateHealthUnit(unit.id),
            {
                name: unit.name,
                type: unit.type,
                cnpj: unit.cnpj,
                complexity: unit.complexity,
                active: !unit.active,
                contractor_id: String(unit.contractor?.id ?? ''),
                zip_code: unit.zip_code,
                street: unit.street,
                number: unit.number,
                complement: unit.complement,
                neighborhood: unit.neighborhood,
                city: unit.city,
                state: unit.state,
                latitude: unit.latitude,
                longitude: unit.longitude,
                serves_adult: unit.serves_adult,
                serves_pediatric: unit.serves_pediatric,
                serves_gyneco: unit.serves_gyneco,
                serves_neurology: unit.serves_neurology,
                serves_cardiology: unit.serves_cardiology,
                serves_orthopedics: unit.serves_orthopedics,
                opening_time: unit.opening_time,
                closing_time: unit.closing_time,
                operating_days: unit.operating_days,
                daily_capacity: unit.daily_capacity,
            },
            {
                only: ['health_units', 'filters'],
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    setUpdatingHealthUnitId(null);
                },
            },
        );
    };

    return (
        <>
            <Head title="Unidades de Saúde" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title="Unidades de Saúde"
                        description="Gerencie as unidades de saúde do seu contratante."
                    />

                    <Button onClick={handleCreate}>
                        <Plus />
                        Nova unidade
                    </Button>
                </div>

                <HealthUnitsTable
                    healthUnits={healthUnits}
                    filters={filters}
                    contractors={contractors}
                    updatingHealthUnitId={updatingHealthUnitId}
                    isAdmin={false}
                    onCreate={handleCreate}
                    onView={handleView}
                    onEdit={handleEdit}
                    onStatusToggle={handleStatusToggle}
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                />
            </div>

            <HealthUnitSheet
                open={sheetOpen}
                onOpenChange={(open) => {
                    setSheetOpen(open);

                    if (!open) {
                        setSelectedHealthUnit(null);
                    }
                }}
                mode={sheetMode}
                healthUnit={selectedHealthUnit}
                contractors={contractors}
                isAdmin={false}
                onEdit={handleEdit}
                onSuccess={() => {
                    setSheetOpen(false);
                    setSelectedHealthUnit(null);
                    setSheetMode('create');
                }}
            />
        </>
    );
}

HealthUnitsIndex.layout = {
    breadcrumbs: [{ title: 'Unidades de Saúde', href: index() }],
};
