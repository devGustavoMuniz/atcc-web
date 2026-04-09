import { Head, router } from '@inertiajs/react';
import {
    Building2,
    ChevronDown,
    ChevronUp,
    ChevronsUpDown,
    FileText,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import ContractorController from '@/actions/App/Http/Controllers/Admin/ContractorController';
import ContractorForm from '@/components/contractors/contractor-form';
import Heading from '@/components/heading';
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
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
import { useTableFilters } from '@/hooks/use-table-filters';
import { formatCnpj } from '@/lib/formatters';
import {
    destroy,
    index,
    update as updateContractor,
} from '@/routes/admin/contractors';
import type {
    ContractorFilters,
    ContractorRow,
    LaravelPaginator,
    SheetMode,
} from '@/types';

type Props = {
    contractors: LaravelPaginator<ContractorRow>;
    filters: Partial<ContractorFilters> & {
        search_name: string | null;
        search_cnpj: string | null;
        status: string | null;
    };
};

function getSortIcon(
    column: 'name' | 'cnpj' | 'active',
    sort: string,
    direction: string,
) {
    if (sort !== column) {
        return <ChevronsUpDown className="size-4 text-muted-foreground" />;
    }

    if (direction === 'asc') {
        return <ChevronUp className="size-4" />;
    }

    return <ChevronDown className="size-4" />;
}

export default function ContractorsIndex({
    contractors,
    filters: initialFilters,
}: Props) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [sheetMode, setSheetMode] = useState<SheetMode>('create');
    const [updatingContractorId, setUpdatingContractorId] = useState<
        number | null
    >(null);
    const [selectedContractor, setSelectedContractor] =
        useState<ContractorRow | null>(null);
    const { filters, handleFilterChange, handleSortChange } = useTableFilters<ContractorFilters>({
        initialFilters: {
            search_name: initialFilters.search_name ?? '',
            search_cnpj: initialFilters.search_cnpj ?? '',
            status: initialFilters.status ?? '',
            sort: initialFilters.sort ?? 'name',
            direction: initialFilters.direction ?? 'asc',
        },
        url: index.url(),
    });

    const formContractor = selectedContractor ?? {
        name: '',
        cnpj: '',
        active: true,
    };

    const handleCreate = () => {
        setSheetMode('create');
        setSelectedContractor(null);
        setSheetOpen(true);
    };

    const handleView = (contractor: ContractorRow) => {
        setSheetMode('view');
        setSelectedContractor(contractor);
        setSheetOpen(true);
    };

    const handleEdit = (contractor: ContractorRow) => {
        setSheetMode('edit');
        setSelectedContractor(contractor);
        setSheetOpen(true);
    };

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
            <Head title="Contractors" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title="Contractors"
                        description="Gerencie as contratantes vinculadas ao ambiente administrativo."
                    />

                    <Button onClick={handleCreate}>
                        <Plus />
                        Novo contractor
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Listagem</CardTitle>
                        <CardDescription>
                            {contractors.data.length} contractor(s) na página
                            atual.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {contractors.data.length === 0 ? (
                            <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 py-12 text-center">
                                <div className="mb-4 rounded-full border border-border/80 bg-background p-3 shadow-sm">
                                    <Building2 className="size-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">
                                    Nenhum contractor cadastrado
                                </h3>
                                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                    Crie a primeira contratante para comecar a
                                    organizar os vinculos administrativos.
                                </p>
                                <Button className="mt-6" onClick={handleCreate}>
                                    <Plus />
                                    Novo contractor
                                </Button>
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
                                                                filters.sort ===
                                                                'name'
                                                                    ? 'text-foreground'
                                                                    : 'hover:text-foreground'
                                                            }`}
                                                            onClick={() =>
                                                                handleSortChange(
                                                                    'name',
                                                                )
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
                                                            value={
                                                                filters.search_name
                                                            }
                                                            onChange={(event) =>
                                                                handleFilterChange(
                                                                    'search_name',
                                                                    event.target
                                                                        .value,
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
                                                                filters.sort ===
                                                                'cnpj'
                                                                    ? 'text-foreground'
                                                                    : 'hover:text-foreground'
                                                            }`}
                                                            onClick={() =>
                                                                handleSortChange(
                                                                    'cnpj',
                                                                )
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
                                                            value={
                                                                filters.search_cnpj
                                                            }
                                                            onChange={(event) =>
                                                                handleFilterChange(
                                                                    'search_cnpj',
                                                                    event.target
                                                                        .value,
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
                                                                handleSortChange(
                                                                    'active',
                                                                )
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
                                                                filters.status ===
                                                                ''
                                                                    ? 'all'
                                                                    : filters.status
                                                            }
                                                            onValueChange={(
                                                                value,
                                                            ) =>
                                                                handleFilterChange(
                                                                    'status',
                                                                    value ===
                                                                        'all'
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
                                            {contractors.data.map(
                                                (contractor) => (
                                                    <TableRow
                                                        key={contractor.id}
                                                        className="cursor-pointer odd:bg-muted/[0.16] even:bg-background hover:bg-muted/30"
                                                        onClick={() =>
                                                            handleView(
                                                                contractor,
                                                            )
                                                        }
                                                    >
                                                        <TableCell className="border-r border-border/70 px-5 py-4 align-middle font-medium">
                                                            <div className="flex min-h-10 items-center justify-center text-center">
                                                                {
                                                                    contractor.name
                                                                }
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
                                                                onClick={(
                                                                    event,
                                                                ) =>
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
                                                                        handleStatusToggle(
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
                                                                                    handleEdit(
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
                                                ),
                                            )}
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
                                                        contractors.prev_page_url ??
                                                        '#'
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
                                                    /^\d+$/.test(
                                                        pageLink.label,
                                                    ),
                                                )
                                                .map((pageLink) => (
                                                    <PaginationItem
                                                        key={pageLink.label}
                                                    >
                                                        <PaginationLink
                                                            href={
                                                                pageLink.url ??
                                                                '#'
                                                            }
                                                            isActive={
                                                                pageLink.active
                                                            }
                                                            aria-disabled={
                                                                pageLink.url ===
                                                                null
                                                            }
                                                            className={
                                                                pageLink.url ===
                                                                null
                                                                    ? 'pointer-events-none opacity-50'
                                                                    : ''
                                                            }
                                                            onClick={(
                                                                event,
                                                            ) => {
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
                                                        contractors.next_page_url ??
                                                        '#'
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
            </div>

            <Sheet
                open={sheetOpen}
                onOpenChange={(open) => {
                    setSheetOpen(open);

                    if (!open) {
                        setSelectedContractor(null);
                    }
                }}
            >
                <SheetContent className="w-full gap-0 sm:max-w-xl">
                    <SheetHeader className="border-b px-6 py-6 pr-14">
                        <SheetTitle>
                            {sheetMode === 'create'
                                ? 'Novo contractor'
                                : sheetMode === 'edit'
                                  ? 'Editar contractor'
                                  : 'Detalhes do contractor'}
                        </SheetTitle>
                        <SheetDescription>
                            {sheetMode === 'create'
                                ? 'Cadastre uma nova contratante no painel administrativo.'
                                : sheetMode === 'edit'
                                  ? 'Atualize os dados basicos da contratante selecionada.'
                                  : 'Visualize os dados da contratante selecionada.'}
                        </SheetDescription>
                    </SheetHeader>

                    {sheetMode === 'view' && selectedContractor !== null ? (
                        <div className="flex h-full flex-col overflow-hidden">
                            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                                <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="rounded-full border border-border/70 bg-background p-2">
                                            <FileText className="size-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {selectedContractor.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Contractor administrativo
                                            </p>
                                        </div>
                                    </div>

                                    <dl className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <dt className="text-sm font-medium text-muted-foreground">
                                                Nome
                                            </dt>
                                            <dd className="text-sm font-medium">
                                                {selectedContractor.name}
                                            </dd>
                                        </div>
                                        <div className="space-y-1">
                                            <dt className="text-sm font-medium text-muted-foreground">
                                                CNPJ
                                            </dt>
                                            <dd className="text-sm font-medium">
                                                {formatCnpj(
                                                    selectedContractor.cnpj,
                                                )}
                                            </dd>
                                        </div>
                                        <div className="space-y-1">
                                            <dt className="text-sm font-medium text-muted-foreground">
                                                Status
                                            </dt>
                                            <dd>
                                                <Badge
                                                    variant={
                                                        selectedContractor.active
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                >
                                                    {selectedContractor.active
                                                        ? 'Ativo'
                                                        : 'Inativo'}
                                                </Badge>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            <div className="border-t px-6 py-4">
                                <Button
                                    onClick={() =>
                                        handleEdit(selectedContractor)
                                    }
                                >
                                    <Pencil />
                                    Editar contractor
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <ContractorForm
                            key={`${sheetMode}-${selectedContractor?.id ?? 'new'}`}
                            action={
                                sheetMode === 'create' ||
                                selectedContractor === null
                                    ? ContractorController.store()
                                    : ContractorController.update(
                                          selectedContractor.id,
                                      )
                            }
                            contractor={formContractor}
                            submitLabel={
                                sheetMode === 'create'
                                    ? 'Criar contractor'
                                    : 'Salvar alterações'
                            }
                            onSuccess={() => {
                                setSheetOpen(false);
                                setSelectedContractor(null);
                                setSheetMode('create');
                            }}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
}

ContractorsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Contractors',
            href: index(),
        },
    ],
};
