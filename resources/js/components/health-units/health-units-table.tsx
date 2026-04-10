import { router } from '@inertiajs/react';
import {
    Building,
    ChevronDown,
    ChevronUp,
    ChevronsUpDown,
    Pencil,
    Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { StatusToggle } from '@/components/ui/status-toggle';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { destroy as adminDestroy } from '@/routes/admin/health-units';
import { destroy as managerDestroy } from '@/routes/manager/health-units';
import type {
    ContractorOption,
    HealthUnitComplexity,
    HealthUnitFilters,
    HealthUnitRow,
    HealthUnitType,
    LaravelPaginator,
} from '@/types';

type HealthUnitsTableProps = {
    healthUnits: LaravelPaginator<HealthUnitRow>;
    filters: HealthUnitFilters;
    contractors: ContractorOption[];
    updatingHealthUnitId: number | null;
    isAdmin: boolean;
    onCreate?: () => void;
    onView: (unit: HealthUnitRow) => void;
    onEdit: (unit: HealthUnitRow) => void;
    onStatusToggle: (unit: HealthUnitRow) => void;
    onFilterChange: (key: keyof HealthUnitFilters, value: string) => void;
    onSortChange: (column: HealthUnitFilters['sort']) => void;
};

const healthUnitTypeLabels: Record<HealthUnitType, string> = {
    ubs: 'UBS',
    upa: 'UPA',
    hospital: 'Hospital',
};

const healthUnitComplexityLabels: Record<HealthUnitComplexity, string> = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
};

function getSortIcon(
    column: HealthUnitFilters['sort'],
    sort: HealthUnitFilters['sort'],
    direction: HealthUnitFilters['direction'],
) {
    if (sort !== column) {
        return <ChevronsUpDown className="size-4 text-muted-foreground" />;
    }

    if (direction === 'asc') {
        return <ChevronUp className="size-4" />;
    }

    return <ChevronDown className="size-4" />;
}

function getComplexityBadgeVariant(complexity: HealthUnitComplexity) {
    if (complexity === 'low') {
        return 'outline';
    }

    if (complexity === 'medium') {
        return 'secondary';
    }

    return 'default';
}

export function HealthUnitsTable({
    healthUnits,
    filters,
    contractors,
    updatingHealthUnitId,
    isAdmin,
    onCreate,
    onView,
    onEdit,
    onStatusToggle,
    onFilterChange,
    onSortChange,
}: HealthUnitsTableProps) {
    const destroyRoute = isAdmin ? adminDestroy : managerDestroy;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Listagem</CardTitle>
                <CardDescription>
                    {healthUnits.data.length} unidade(s) de saúde na página
                    atual.
                </CardDescription>
            </CardHeader>

            <CardContent>
                {healthUnits.data.length === 0 ? (
                    <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 py-12 text-center">
                        <div className="mb-4 rounded-full border border-border/80 bg-background p-3 shadow-sm">
                            <Building className="size-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">
                            Nenhuma unidade de saúde cadastrada
                        </h3>
                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                            Cadastre a primeira unidade para organizar a rede
                            assistencial vinculada ao sistema.
                        </p>
                        {onCreate ? (
                            <Button className="mt-6" onClick={onCreate}>
                                Nova unidade
                            </Button>
                        ) : null}
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-3 pb-4 sm:hidden">
                            <Input
                                value={filters.search_name}
                                onChange={(event) =>
                                    onFilterChange(
                                        'search_name',
                                        event.target.value,
                                    )
                                }
                                placeholder="Buscar por nome"
                            />
                            <Select
                                value={
                                    filters.search_type === ''
                                        ? 'all'
                                        : filters.search_type
                                }
                                onValueChange={(value) =>
                                    onFilterChange(
                                        'search_type',
                                        value === 'all' ? '' : value,
                                    )
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent align="start">
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="ubs">UBS</SelectItem>
                                    <SelectItem value="upa">UPA</SelectItem>
                                    <SelectItem value="hospital">
                                        Hospital
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                value={filters.search_city}
                                onChange={(event) =>
                                    onFilterChange(
                                        'search_city',
                                        event.target.value,
                                    )
                                }
                                placeholder="Buscar por cidade"
                            />
                            <Select
                                value={
                                    filters.search_complexity === ''
                                        ? 'all'
                                        : filters.search_complexity
                                }
                                onValueChange={(value) =>
                                    onFilterChange(
                                        'search_complexity',
                                        value === 'all' ? '' : value,
                                    )
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent align="start">
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="low">Baixa</SelectItem>
                                    <SelectItem value="medium">
                                        Média
                                    </SelectItem>
                                    <SelectItem value="high">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                            {isAdmin ? (
                                <Select
                                    value={
                                        filters.contractor_id === ''
                                            ? 'all'
                                            : filters.contractor_id
                                    }
                                    onValueChange={(value) =>
                                        onFilterChange(
                                            'contractor_id',
                                            value === 'all' ? '' : value,
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent align="start">
                                        <SelectItem value="all">
                                            Todos
                                        </SelectItem>
                                        {contractors.map((contractor) => (
                                            <SelectItem
                                                key={contractor.id}
                                                value={String(contractor.id)}
                                            >
                                                {contractor.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : null}
                            <Select
                                value={
                                    filters.status === ''
                                        ? 'all'
                                        : filters.status
                                }
                                onValueChange={(value) =>
                                    onFilterChange(
                                        'status',
                                        value === 'all' ? '' : value,
                                    )
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent align="start">
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="1">Ativo</SelectItem>
                                    <SelectItem value="0">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={filters.sort}
                                onValueChange={(value) =>
                                    onSortChange(
                                        value as HealthUnitFilters['sort'],
                                    )
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Ordenar por" />
                                </SelectTrigger>
                                <SelectContent align="start">
                                    <SelectItem
                                        value="name"
                                        onClick={() => {
                                            if (filters.sort === 'name') {
                                                onSortChange('name');
                                            }
                                        }}
                                    >
                                        {filters.sort === 'name'
                                            ? 'Nome *'
                                            : 'Nome'}
                                    </SelectItem>
                                    <SelectItem
                                        value="type"
                                        onClick={() => {
                                            if (filters.sort === 'type') {
                                                onSortChange('type');
                                            }
                                        }}
                                    >
                                        {filters.sort === 'type'
                                            ? 'Tipo *'
                                            : 'Tipo'}
                                    </SelectItem>
                                    <SelectItem
                                        value="city"
                                        onClick={() => {
                                            if (filters.sort === 'city') {
                                                onSortChange('city');
                                            }
                                        }}
                                    >
                                        {filters.sort === 'city'
                                            ? 'Cidade *'
                                            : 'Cidade'}
                                    </SelectItem>
                                    <SelectItem
                                        value="complexity"
                                        onClick={() => {
                                            if (filters.sort === 'complexity') {
                                                onSortChange('complexity');
                                            }
                                        }}
                                    >
                                        {filters.sort === 'complexity'
                                            ? 'Complexidade *'
                                            : 'Complexidade'}
                                    </SelectItem>
                                    <SelectItem
                                        value="active"
                                        onClick={() => {
                                            if (filters.sort === 'active') {
                                                onSortChange('active');
                                            }
                                        }}
                                    >
                                        {filters.sort === 'active'
                                            ? 'Status *'
                                            : 'Status'}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="hidden overflow-x-auto rounded-lg border border-border/70 sm:block">
                            <Table
                                className={
                                    isAdmin ? 'min-w-[1180px]' : 'min-w-[960px]'
                                }
                            >
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="border-r border-border/80 px-5 pt-4 pb-3 align-top">
                                            <div className="space-y-3">
                                                <button
                                                    type="button"
                                                    className={`flex w-full cursor-pointer items-center justify-between gap-3 text-left transition-colors ${
                                                        filters.sort === 'name'
                                                            ? 'text-foreground'
                                                            : 'hover:text-foreground'
                                                    }`}
                                                    onClick={() =>
                                                        onSortChange('name')
                                                    }
                                                >
                                                    <span>Nome</span>
                                                    {getSortIcon(
                                                        'name',
                                                        filters.sort,
                                                        filters.direction,
                                                    )}
                                                </button>
                                                <Input
                                                    value={filters.search_name}
                                                    onChange={(event) =>
                                                        onFilterChange(
                                                            'search_name',
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="Buscar por nome"
                                                />
                                            </div>
                                        </TableHead>
                                        <TableHead className="border-r border-border/80 px-5 pt-4 pb-3 align-top">
                                            <div className="space-y-3">
                                                <button
                                                    type="button"
                                                    className={`flex w-full cursor-pointer items-center justify-between gap-3 text-left transition-colors ${
                                                        filters.sort === 'type'
                                                            ? 'text-foreground'
                                                            : 'hover:text-foreground'
                                                    }`}
                                                    onClick={() =>
                                                        onSortChange('type')
                                                    }
                                                >
                                                    <span>Tipo</span>
                                                    {getSortIcon(
                                                        'type',
                                                        filters.sort,
                                                        filters.direction,
                                                    )}
                                                </button>
                                                <Select
                                                    value={
                                                        filters.search_type ===
                                                        ''
                                                            ? 'all'
                                                            : filters.search_type
                                                    }
                                                    onValueChange={(value) =>
                                                        onFilterChange(
                                                            'search_type',
                                                            value === 'all'
                                                                ? ''
                                                                : value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Todos" />
                                                    </SelectTrigger>
                                                    <SelectContent align="start">
                                                        <SelectItem value="all">
                                                            Todos
                                                        </SelectItem>
                                                        <SelectItem value="ubs">
                                                            UBS
                                                        </SelectItem>
                                                        <SelectItem value="upa">
                                                            UPA
                                                        </SelectItem>
                                                        <SelectItem value="hospital">
                                                            Hospital
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TableHead>
                                        <TableHead className="border-r border-border/80 px-5 pt-4 pb-3 align-top">
                                            <div className="space-y-3">
                                                <button
                                                    type="button"
                                                    className={`flex w-full cursor-pointer items-center justify-between gap-3 text-left transition-colors ${
                                                        filters.sort === 'city'
                                                            ? 'text-foreground'
                                                            : 'hover:text-foreground'
                                                    }`}
                                                    onClick={() =>
                                                        onSortChange('city')
                                                    }
                                                >
                                                    <span>Cidade</span>
                                                    {getSortIcon(
                                                        'city',
                                                        filters.sort,
                                                        filters.direction,
                                                    )}
                                                </button>
                                                <Input
                                                    value={filters.search_city}
                                                    onChange={(event) =>
                                                        onFilterChange(
                                                            'search_city',
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="Buscar por cidade"
                                                />
                                            </div>
                                        </TableHead>
                                        {isAdmin ? (
                                            <TableHead className="border-r border-border/80 px-5 pt-4 pb-3 align-top">
                                                <div className="space-y-3">
                                                    <span className="block text-sm font-medium">
                                                        Contratante
                                                    </span>
                                                    <Select
                                                        value={
                                                            filters.contractor_id ===
                                                            ''
                                                                ? 'all'
                                                                : filters.contractor_id
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            onFilterChange(
                                                                'contractor_id',
                                                                value === 'all'
                                                                    ? ''
                                                                    : value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Todos" />
                                                        </SelectTrigger>
                                                        <SelectContent align="start">
                                                            <SelectItem value="all">
                                                                Todos
                                                            </SelectItem>
                                                            {contractors.map(
                                                                (
                                                                    contractor,
                                                                ) => (
                                                                    <SelectItem
                                                                        key={
                                                                            contractor.id
                                                                        }
                                                                        value={String(
                                                                            contractor.id,
                                                                        )}
                                                                    >
                                                                        {
                                                                            contractor.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </TableHead>
                                        ) : null}
                                        <TableHead className="border-r border-border/80 px-5 pt-4 pb-3 align-top">
                                            <div className="space-y-3">
                                                <button
                                                    type="button"
                                                    className={`flex w-full cursor-pointer items-center justify-between gap-3 text-left transition-colors ${
                                                        filters.sort ===
                                                        'complexity'
                                                            ? 'text-foreground'
                                                            : 'hover:text-foreground'
                                                    }`}
                                                    onClick={() =>
                                                        onSortChange(
                                                            'complexity',
                                                        )
                                                    }
                                                >
                                                    <span>Complexidade</span>
                                                    {getSortIcon(
                                                        'complexity',
                                                        filters.sort,
                                                        filters.direction,
                                                    )}
                                                </button>
                                                <Select
                                                    value={
                                                        filters.search_complexity ===
                                                        ''
                                                            ? 'all'
                                                            : filters.search_complexity
                                                    }
                                                    onValueChange={(value) =>
                                                        onFilterChange(
                                                            'search_complexity',
                                                            value === 'all'
                                                                ? ''
                                                                : value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Todos" />
                                                    </SelectTrigger>
                                                    <SelectContent align="start">
                                                        <SelectItem value="all">
                                                            Todos
                                                        </SelectItem>
                                                        <SelectItem value="low">
                                                            Baixa
                                                        </SelectItem>
                                                        <SelectItem value="medium">
                                                            Média
                                                        </SelectItem>
                                                        <SelectItem value="high">
                                                            Alta
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TableHead>
                                        <TableHead className="border-r border-border/80 px-5 pt-4 pb-3 align-top">
                                            <div className="space-y-3">
                                                <button
                                                    type="button"
                                                    className={`flex w-full cursor-pointer items-center justify-between gap-3 text-left transition-colors ${
                                                        filters.sort ===
                                                        'active'
                                                            ? 'text-foreground'
                                                            : 'hover:text-foreground'
                                                    }`}
                                                    onClick={() =>
                                                        onSortChange('active')
                                                    }
                                                >
                                                    <span>Status</span>
                                                    {getSortIcon(
                                                        'active',
                                                        filters.sort,
                                                        filters.direction,
                                                    )}
                                                </button>
                                                <Select
                                                    value={
                                                        filters.status === ''
                                                            ? 'all'
                                                            : filters.status
                                                    }
                                                    onValueChange={(value) =>
                                                        onFilterChange(
                                                            'status',
                                                            value === 'all'
                                                                ? ''
                                                                : value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Todos" />
                                                    </SelectTrigger>
                                                    <SelectContent align="start">
                                                        <SelectItem value="all">
                                                            Todos
                                                        </SelectItem>
                                                        <SelectItem value="1">
                                                            Ativo
                                                        </SelectItem>
                                                        <SelectItem value="0">
                                                            Inativo
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TableHead>
                                        <TableHead className="px-5 pt-4 pb-3 text-center align-middle">
                                            Ações
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {healthUnits.data.map((healthUnit) => (
                                        <TableRow
                                            key={healthUnit.id}
                                            className="cursor-pointer odd:bg-muted/[0.16] even:bg-background hover:bg-muted/30"
                                            onClick={() => onView(healthUnit)}
                                        >
                                            <TableCell className="border-r border-border/70 px-5 py-4 align-middle font-medium">
                                                <div className="flex min-h-10 items-center justify-center text-center">
                                                    {healthUnit.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="border-r border-border/70 px-5 py-4 align-middle">
                                                <div className="flex min-h-10 items-center justify-center text-center text-muted-foreground">
                                                    {
                                                        healthUnitTypeLabels[
                                                            healthUnit.type
                                                        ]
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell className="border-r border-border/70 px-5 py-4 align-middle text-muted-foreground">
                                                <div className="flex min-h-10 items-center justify-center text-center">
                                                    {healthUnit.city}
                                                </div>
                                            </TableCell>
                                            {isAdmin ? (
                                                <TableCell className="border-r border-border/70 px-5 py-4 align-middle text-muted-foreground">
                                                    <div className="flex min-h-10 items-center justify-center text-center">
                                                        {healthUnit.contractor
                                                            ?.name ??
                                                            'Não vinculada'}
                                                    </div>
                                                </TableCell>
                                            ) : null}
                                            <TableCell className="border-r border-border/70 px-5 py-4 align-middle">
                                                <div className="flex min-h-10 items-center justify-center">
                                                    <Badge
                                                        variant={getComplexityBadgeVariant(
                                                            healthUnit.complexity,
                                                        )}
                                                    >
                                                        {
                                                            healthUnitComplexityLabels[
                                                                healthUnit
                                                                    .complexity
                                                            ]
                                                        }
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="border-r border-border/70 px-5 py-4 align-middle">
                                                <div
                                                    className="flex min-h-10 items-center justify-center"
                                                    onClick={(event) =>
                                                        event.stopPropagation()
                                                    }
                                                >
                                                    <StatusToggle
                                                        ariaLabel={`Alternar status de ${healthUnit.name}`}
                                                        checked={
                                                            healthUnit.active
                                                        }
                                                        disabled={
                                                            updatingHealthUnitId ===
                                                            healthUnit.id
                                                        }
                                                        onPressedChange={() =>
                                                            onStatusToggle(
                                                                healthUnit,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 align-middle">
                                                <TooltipProvider>
                                                    <div className="flex min-h-10 items-center justify-center gap-1">
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="bg-muted/40 hover:bg-muted"
                                                                    onClick={(
                                                                        event,
                                                                    ) => {
                                                                        event.stopPropagation();
                                                                        onEdit(
                                                                            healthUnit,
                                                                        );
                                                                    }}
                                                                >
                                                                    <Pencil />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                Editar
                                                            </TooltipContent>
                                                        </Tooltip>

                                                        <Dialog>
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <DialogTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive"
                                                                            onClick={(
                                                                                event,
                                                                            ) =>
                                                                                event.stopPropagation()
                                                                            }
                                                                        >
                                                                            <Trash2 />
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    Excluir
                                                                </TooltipContent>
                                                            </Tooltip>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>
                                                                        Excluir
                                                                        unidade
                                                                        de saúde
                                                                    </DialogTitle>
                                                                    <DialogDescription>
                                                                        Essa
                                                                        ação
                                                                        remove{' '}
                                                                        {
                                                                            healthUnit.name
                                                                        }{' '}
                                                                        permanentemente.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <DialogFooter>
                                                                    <DialogClose
                                                                        asChild
                                                                    >
                                                                        <Button variant="outline">
                                                                            Cancelar
                                                                        </Button>
                                                                    </DialogClose>
                                                                    <Button
                                                                        variant="destructive"
                                                                        onClick={() => {
                                                                            router.delete(
                                                                                destroyRoute(
                                                                                    healthUnit.id,
                                                                                ),
                                                                                {
                                                                                    preserveScroll: true,
                                                                                },
                                                                            );
                                                                        }}
                                                                    >
                                                                        Excluir
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </TooltipProvider>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex flex-col gap-3 sm:hidden">
                            {healthUnits.data.map((healthUnit) => (
                                <div
                                    key={healthUnit.id}
                                    className="cursor-pointer rounded-lg border border-border/70 bg-card p-4 transition-colors hover:bg-muted/20"
                                    onClick={() => onView(healthUnit)}
                                >
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                        <span className="leading-tight font-medium">
                                            {healthUnit.name}
                                        </span>
                                        <div
                                            onClick={(event) =>
                                                event.stopPropagation()
                                            }
                                        >
                                            <StatusToggle
                                                ariaLabel={`Alternar status de ${healthUnit.name}`}
                                                checked={healthUnit.active}
                                                disabled={
                                                    updatingHealthUnitId ===
                                                    healthUnit.id
                                                }
                                                onPressedChange={() =>
                                                    onStatusToggle(healthUnit)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3 space-y-1.5 text-sm text-muted-foreground">
                                        <div className="flex items-center justify-between gap-3">
                                            <span>Tipo</span>
                                            <span className="text-right">
                                                {
                                                    healthUnitTypeLabels[
                                                        healthUnit.type
                                                    ]
                                                }
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span>Cidade</span>
                                            <span className="text-right">
                                                {healthUnit.city}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span>Complexidade</span>
                                            <Badge
                                                variant={getComplexityBadgeVariant(
                                                    healthUnit.complexity,
                                                )}
                                            >
                                                {
                                                    healthUnitComplexityLabels[
                                                        healthUnit.complexity
                                                    ]
                                                }
                                            </Badge>
                                        </div>
                                        {isAdmin ? (
                                            <div className="flex items-center justify-between gap-3">
                                                <span>Contratante</span>
                                                <span className="text-right">
                                                    {healthUnit.contractor
                                                        ?.name ??
                                                        'Não vinculada'}
                                                </span>
                                            </div>
                                        ) : null}
                                    </div>

                                    <div
                                        className="flex justify-end gap-2 border-t border-border/50 pt-3"
                                        onClick={(event) =>
                                            event.stopPropagation()
                                        }
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="bg-muted/40 hover:bg-muted"
                                            onClick={() => onEdit(healthUnit)}
                                        >
                                            <Pencil />
                                        </Button>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive"
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Excluir unidade de saúde
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Essa ação remove{' '}
                                                        {healthUnit.name}{' '}
                                                        permanentemente.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">
                                                            Cancelar
                                                        </Button>
                                                    </DialogClose>
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() => {
                                                            router.delete(
                                                                destroyRoute(
                                                                    healthUnit.id,
                                                                ),
                                                                {
                                                                    preserveScroll: true,
                                                                },
                                                            );
                                                        }}
                                                    >
                                                        Excluir
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                                Página {healthUnits.current_page} de{' '}
                                {healthUnits.last_page}
                            </p>

                            <Pagination className="mx-0 w-auto">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={
                                                healthUnits.prev_page_url ?? '#'
                                            }
                                            aria-disabled={
                                                healthUnits.prev_page_url ===
                                                null
                                            }
                                            className={
                                                healthUnits.prev_page_url ===
                                                null
                                                    ? 'pointer-events-none opacity-50'
                                                    : ''
                                            }
                                            onClick={(event) => {
                                                event.preventDefault();

                                                if (
                                                    healthUnits.prev_page_url !==
                                                    null
                                                ) {
                                                    router.visit(
                                                        healthUnits.prev_page_url,
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    );
                                                }
                                            }}
                                        />
                                    </PaginationItem>

                                    {healthUnits.links
                                        .filter((pageLink) =>
                                            /^\d+$/.test(pageLink.label),
                                        )
                                        .map((pageLink) => (
                                            <PaginationItem
                                                key={pageLink.label}
                                            >
                                                <PaginationLink
                                                    href={pageLink.url ?? '#'}
                                                    isActive={pageLink.active}
                                                    aria-disabled={
                                                        pageLink.url === null
                                                    }
                                                    className={
                                                        pageLink.url === null
                                                            ? 'pointer-events-none opacity-50'
                                                            : ''
                                                    }
                                                    onClick={(event) => {
                                                        event.preventDefault();

                                                        if (
                                                            pageLink.url !==
                                                            null
                                                        ) {
                                                            router.visit(
                                                                pageLink.url,
                                                                {
                                                                    preserveScroll: true,
                                                                },
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {pageLink.label}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            href={
                                                healthUnits.next_page_url ?? '#'
                                            }
                                            aria-disabled={
                                                healthUnits.next_page_url ===
                                                null
                                            }
                                            className={
                                                healthUnits.next_page_url ===
                                                null
                                                    ? 'pointer-events-none opacity-50'
                                                    : ''
                                            }
                                            onClick={(event) => {
                                                event.preventDefault();

                                                if (
                                                    healthUnits.next_page_url !==
                                                    null
                                                ) {
                                                    router.visit(
                                                        healthUnits.next_page_url,
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    );
                                                }
                                            }}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
