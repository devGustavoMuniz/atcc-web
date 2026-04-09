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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTableFilters } from '@/hooks/use-table-filters';
import { destroy, index, update as updateContractor } from '@/routes/admin/contractors';

type ContractorRow = {
    id: number;
    name: string;
    cnpj: string | null;
    active: boolean;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    contractors: {
        data: ContractorRow[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
        links: PaginationLink[];
    };
    filters: {
        search_name: string | null;
        search_cnpj: string | null;
        status: string | null;
        sort: 'name' | 'cnpj' | 'active';
        direction: 'asc' | 'desc';
    };
};

type SheetMode = 'create' | 'view' | 'edit';

function formatCnpj(value: string | null): string {
    if (value === null || value === '') {
        return 'Nao informado';
    }

    const digits = value.replace(/\D/g, '').slice(0, 14);

    if (digits.length !== 14) {
        return value;
    }

    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

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
    const { filters, handleFilterChange, handleSortChange } = useTableFilters({
        initialFilters: {
            search_name: initialFilters.search_name ?? '',
            search_cnpj: initialFilters.search_cnpj ?? '',
            status: initialFilters.status ?? '',
            sort: initialFilters.sort,
            direction: initialFilters.direction,
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
                                    <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
                                        <thead className="text-muted-foreground">
                                            <tr>
                                                <th className="border-r border-border/80 px-5 pt-4 pb-3 align-top font-medium">
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
                                                </th>
                                                <th className="border-r border-border/80 px-5 pt-4 pb-3 align-top font-medium">
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
                                                </th>
                                                <th className="border-r border-border/80 px-5 pt-4 pb-3 align-top font-medium">
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
                                                </th>
                                                <th className="px-5 pt-4 pb-3 text-center align-middle font-medium">
                                                    Ações
                                                </th>
                                            </tr>
                                            <tr>
                                                <th
                                                    colSpan={4}
                                                    className="h-0 border-b border-border/70 p-0"
                                                />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contractors.data.map(
                                                (contractor, rowIndex) => (
                                                    <tr
                                                        key={contractor.id}
                                                        className="cursor-pointer transition-colors odd:bg-muted/[0.16] even:bg-background hover:bg-muted/30"
                                                        onClick={() =>
                                                            handleView(
                                                                contractor,
                                                            )
                                                        }
                                                    >
                                                        <td
                                                            className={`border-r border-border/70 px-5 py-4 align-middle ${
                                                                rowIndex ===
                                                                contractors.data.length -
                                                                    1
                                                                    ? ''
                                                                    : 'border-b'
                                                            }`}
                                                        >
                                                            <div className="flex min-h-10 items-center justify-center text-center font-medium">
                                                                {
                                                                    contractor.name
                                                                }
                                                            </div>
                                                        </td>
                                                        <td
                                                            className={`border-r border-border/70 px-5 py-4 align-middle text-muted-foreground ${
                                                                rowIndex ===
                                                                contractors.data.length -
                                                                    1
                                                                    ? ''
                                                                    : 'border-b'
                                                            }`}
                                                        >
                                                            <div className="flex min-h-10 items-center justify-center text-center">
                                                                {formatCnpj(
                                                                    contractor.cnpj,
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td
                                                            className={`border-r border-border/70 px-5 py-4 align-middle ${
                                                                rowIndex ===
                                                                contractors.data.length -
                                                                    1
                                                                    ? ''
                                                                    : 'border-b'
                                                            }`}
                                                        >
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
                                                        </td>
                                                        <td
                                                            className={`border-border/70 px-5 py-4 align-middle ${
                                                                rowIndex ===
                                                                contractors.data.length -
                                                                    1
                                                                    ? ''
                                                                    : 'border-b'
                                                            }`}
                                                        >
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
                                                                                acao
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
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        Pagina {contractors.current_page} de{' '}
                                        {contractors.last_page}
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={
                                                contractors.prev_page_url ===
                                                null
                                            }
                                            onClick={() => {
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
                                        >
                                            Anterior
                                        </Button>

                                        {contractors.links
                                            .filter((link) =>
                                                /^\d+$/.test(link.label),
                                            )
                                            .map((link) => (
                                                <Button
                                                    key={link.label}
                                                    variant={
                                                        link.active
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    size="sm"
                                                    disabled={link.url === null}
                                                    onClick={() => {
                                                        if (link.url !== null) {
                                                            router.visit(
                                                                link.url,
                                                                {
                                                                    preserveScroll: true,
                                                                },
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {link.label}
                                                </Button>
                                            ))}

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={
                                                contractors.next_page_url ===
                                                null
                                            }
                                            onClick={() => {
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
                                        >
                                            Próxima
                                        </Button>
                                    </div>
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
