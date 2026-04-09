import { router } from '@inertiajs/react';
import {
    Building2,
    ChevronDown,
    ChevronUp,
    ChevronsUpDown,
    Pencil,
    Trash2,
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
import { formatCnpj } from '@/lib/formatters';
import { destroy } from '@/routes/admin/contractors';
import type {
    ContractorFilters,
    ContractorRow,
    LaravelPaginator,
} from '@/types';

type ContractorsTableProps = {
    contractors: LaravelPaginator<ContractorRow>;
    filters: ContractorFilters;
    updatingContractorId: number | null;
    onCreate?: () => void;
    onView: (contractor: ContractorRow) => void;
    onEdit: (contractor: ContractorRow) => void;
    onStatusToggle: (contractor: ContractorRow) => void;
    onFilterChange: (key: keyof ContractorFilters, value: string) => void;
    onSortChange: (column: ContractorFilters['sort']) => void;
};

function getSortIcon(
    column: ContractorFilters['sort'],
    sort: ContractorFilters['sort'],
    direction: ContractorFilters['direction'],
) {
    if (sort !== column) {
        return <ChevronsUpDown className="size-4 text-muted-foreground" />;
    }

    if (direction === 'asc') {
        return <ChevronUp className="size-4" />;
    }

    return <ChevronDown className="size-4" />;
}

export function ContractorsTable({
    contractors,
    filters,
    updatingContractorId,
    onCreate,
    onView,
    onEdit,
    onStatusToggle,
    onFilterChange,
    onSortChange,
}: ContractorsTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Listagem</CardTitle>
                <CardDescription>
                    {contractors.data.length} contratante(s) na página atual.
                </CardDescription>
            </CardHeader>

            <CardContent>
                {contractors.data.length === 0 ? (
                    <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 py-12 text-center">
                        <div className="mb-4 rounded-full border border-border/80 bg-background p-3 shadow-sm">
                            <Building2 className="size-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">
                            Nenhuma contratante cadastrada
                        </h3>
                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                            Crie a primeira contratante para comecar a organizar
                            os vinculos administrativos.
                        </p>
                        {onCreate ? (
                            <Button className="mt-6" onClick={onCreate}>
                                Nova contratante
                            </Button>
                        ) : null}
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-lg border border-border/70">
                            <Table className="min-w-[640px]">
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
                                                        filters.sort === 'cnpj'
                                                            ? 'text-foreground'
                                                            : 'hover:text-foreground'
                                                    }`}
                                                    onClick={() =>
                                                        onSortChange('cnpj')
                                                    }
                                                >
                                                    <span>CNPJ</span>
                                                    {getSortIcon(
                                                        'cnpj',
                                                        filters.sort,
                                                        filters.direction,
                                                    )}
                                                </button>
                                                <Input
                                                    value={filters.search_cnpj}
                                                    onChange={(event) =>
                                                        onFilterChange(
                                                            'search_cnpj',
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="Buscar por CNPJ"
                                                />
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
                                    {contractors.data.map((contractor) => (
                                        <TableRow
                                            key={contractor.id}
                                            className="cursor-pointer odd:bg-muted/[0.16] even:bg-background hover:bg-muted/30"
                                            onClick={() => onView(contractor)}
                                        >
                                            <TableCell className="border-r border-border/70 px-5 py-4 align-middle font-medium">
                                                <div className="flex min-h-10 items-center justify-center text-center">
                                                    {contractor.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="border-r border-border/70 px-5 py-4 align-middle text-muted-foreground">
                                                <div className="flex min-h-10 items-center justify-center text-center">
                                                    {formatCnpj(
                                                        contractor.cnpj,
                                                    )}
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
                                                        ariaLabel={`Alternar status de ${contractor.name}`}
                                                        checked={
                                                            contractor.active
                                                        }
                                                        disabled={
                                                            updatingContractorId ===
                                                            contractor.id
                                                        }
                                                        onPressedChange={() =>
                                                            onStatusToggle(
                                                                contractor,
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
                                                                            contractor,
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
                                                                        contractor
                                                                    </DialogTitle>
                                                                    <DialogDescription>
                                                                        Essa
                                                                        ação
                                                                        remove{' '}
                                                                        {
                                                                            contractor.name
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
                                                                                    contractor.id,
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
                                Página {contractors.current_page} de{' '}
                                {contractors.last_page}
                            </p>

                            <Pagination className="mx-0 w-auto">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={
                                                contractors.prev_page_url ?? '#'
                                            }
                                            aria-disabled={
                                                contractors.prev_page_url ===
                                                null
                                            }
                                            className={
                                                contractors.prev_page_url ===
                                                null
                                                    ? 'pointer-events-none opacity-50'
                                                    : ''
                                            }
                                            onClick={(event) => {
                                                event.preventDefault();

                                                if (
                                                    contractors.prev_page_url !==
                                                    null
                                                ) {
                                                    router.visit(
                                                        contractors.prev_page_url,
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    );
                                                }
                                            }}
                                        />
                                    </PaginationItem>

                                    {contractors.links
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
                                                contractors.next_page_url ?? '#'
                                            }
                                            aria-disabled={
                                                contractors.next_page_url ===
                                                null
                                            }
                                            className={
                                                contractors.next_page_url ===
                                                null
                                                    ? 'pointer-events-none opacity-50'
                                                    : ''
                                            }
                                            onClick={(event) => {
                                                event.preventDefault();

                                                if (
                                                    contractors.next_page_url !==
                                                    null
                                                ) {
                                                    router.visit(
                                                        contractors.next_page_url,
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
