import { router } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronUp,
    ChevronsUpDown,
    Pencil,
    Trash2,
    Users,
} from 'lucide-react';
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
import { destroy } from '@/routes/admin/managers';
import type {
    ContractorOption,
    LaravelPaginator,
    ManagerFilters,
    ManagerRow,
} from '@/types';

type ManagersTableProps = {
    managers: LaravelPaginator<ManagerRow>;
    filters: ManagerFilters;
    contractors: ContractorOption[];
    updatingManagerId: number | null;
    onCreate?: () => void;
    onView: (manager: ManagerRow) => void;
    onEdit: (manager: ManagerRow) => void;
    onStatusToggle: (manager: ManagerRow) => void;
    onFilterChange: (key: keyof ManagerFilters, value: string) => void;
    onSortChange: (column: ManagerFilters['sort']) => void;
};

function getSortIcon(
    column: ManagerFilters['sort'],
    sort: ManagerFilters['sort'],
    direction: ManagerFilters['direction'],
) {
    if (sort !== column) {
        return <ChevronsUpDown className="size-4 text-muted-foreground" />;
    }

    if (direction === 'asc') {
        return <ChevronUp className="size-4" />;
    }

    return <ChevronDown className="size-4" />;
}

export function ManagersTable({
    managers,
    filters,
    contractors,
    updatingManagerId,
    onCreate,
    onView,
    onEdit,
    onStatusToggle,
    onFilterChange,
    onSortChange,
}: ManagersTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Listagem</CardTitle>
                <CardDescription>
                    {managers.data.length} gestor(es) na página atual.
                </CardDescription>
            </CardHeader>

            <CardContent>
                {managers.data.length === 0 ? (
                    <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 py-12 text-center">
                        <div className="mb-4 rounded-full border border-border/80 bg-background p-3 shadow-sm">
                            <Users className="size-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">
                            Nenhum gestor cadastrado
                        </h3>
                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                            Crie o primeiro gestor para comecar a organizar os
                            acessos administrativos.
                        </p>
                        {onCreate ? (
                            <Button className="mt-6" onClick={onCreate}>
                                Novo gestor
                            </Button>
                        ) : null}
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-lg border border-border/70">
                            <Table className="min-w-[920px]">
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
                                                        filters.sort === 'email'
                                                            ? 'text-foreground'
                                                            : 'hover:text-foreground'
                                                    }`}
                                                    onClick={() =>
                                                        onSortChange('email')
                                                    }
                                                >
                                                    <span>Email</span>
                                                    {getSortIcon(
                                                        'email',
                                                        filters.sort,
                                                        filters.direction,
                                                    )}
                                                </button>
                                                <Input
                                                    value={filters.search_email}
                                                    onChange={(event) =>
                                                        onFilterChange(
                                                            'search_email',
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="Buscar por email"
                                                />
                                            </div>
                                        </TableHead>
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
                                                    onValueChange={(value) =>
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
                                                            (contractor) => (
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
                                    {managers.data.map((manager) => (
                                        <TableRow
                                            key={manager.id}
                                            className="cursor-pointer odd:bg-muted/[0.16] even:bg-background hover:bg-muted/30"
                                            onClick={() => onView(manager)}
                                        >
                                            <TableCell className="border-r border-border/70 px-5 py-4 align-middle font-medium">
                                                <div className="flex min-h-10 items-center justify-center text-center">
                                                    {manager.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="border-r border-border/70 px-5 py-4 align-middle text-muted-foreground">
                                                <div className="flex min-h-10 items-center justify-center text-center">
                                                    {manager.email}
                                                </div>
                                            </TableCell>
                                            <TableCell className="border-r border-border/70 px-5 py-4 align-middle text-muted-foreground">
                                                <div className="flex min-h-10 items-center justify-center text-center">
                                                    {manager.manager_profile
                                                        ?.contractor?.name ??
                                                        'Nao vinculado'}
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
                                                        ariaLabel={`Alternar status de ${manager.name}`}
                                                        checked={manager.active}
                                                        disabled={
                                                            updatingManagerId ===
                                                            manager.id
                                                        }
                                                        onPressedChange={() =>
                                                            onStatusToggle(
                                                                manager,
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
                                                                            manager,
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
                                                                        gestor
                                                                    </DialogTitle>
                                                                    <DialogDescription>
                                                                        Essa
                                                                        ação
                                                                        remove{' '}
                                                                        {
                                                                            manager.name
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
                                                                                destroy(
                                                                                    manager.id,
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

                        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                                Página {managers.current_page} de{' '}
                                {managers.last_page}
                            </p>

                            <Pagination className="mx-0 w-auto">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={managers.prev_page_url ?? '#'}
                                            aria-disabled={
                                                managers.prev_page_url === null
                                            }
                                            className={
                                                managers.prev_page_url === null
                                                    ? 'pointer-events-none opacity-50'
                                                    : ''
                                            }
                                            onClick={(event) => {
                                                event.preventDefault();

                                                if (
                                                    managers.prev_page_url !==
                                                    null
                                                ) {
                                                    router.visit(
                                                        managers.prev_page_url,
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    );
                                                }
                                            }}
                                        />
                                    </PaginationItem>

                                    {managers.links
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
                                            href={managers.next_page_url ?? '#'}
                                            aria-disabled={
                                                managers.next_page_url === null
                                            }
                                            className={
                                                managers.next_page_url === null
                                                    ? 'pointer-events-none opacity-50'
                                                    : ''
                                            }
                                            onClick={(event) => {
                                                event.preventDefault();

                                                if (
                                                    managers.next_page_url !==
                                                    null
                                                ) {
                                                    router.visit(
                                                        managers.next_page_url,
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
