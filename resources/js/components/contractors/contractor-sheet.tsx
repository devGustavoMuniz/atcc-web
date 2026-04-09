import { FileText, Pencil } from 'lucide-react';
import type { ComponentProps } from 'react';
import ContractorController from '@/actions/App/Http/Controllers/Admin/ContractorController';
import ContractorForm from '@/components/contractors/contractor-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { formatCnpj } from '@/lib/formatters';
import type { ContractorRow, SheetMode } from '@/types';

type ContractorSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: SheetMode;
    contractor: ContractorRow | null;
    onEdit: (contractor: ContractorRow) => void;
    onSuccess: () => void;
};

type ContractorFormProps = ComponentProps<typeof ContractorForm>;

export function ContractorSheet({
    open,
    onOpenChange,
    mode,
    contractor,
    onEdit,
    onSuccess,
}: ContractorSheetProps) {
    const formContractor: ContractorFormProps['contractor'] = contractor ?? {
        name: '',
        cnpj: '',
        active: true,
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full gap-0 sm:max-w-xl">
                <SheetHeader className="border-b px-6 py-6 pr-14">
                    <SheetTitle>
                        {mode === 'create'
                            ? 'Novo contractor'
                            : mode === 'edit'
                              ? 'Editar contractor'
                              : 'Detalhes do contractor'}
                    </SheetTitle>
                    <SheetDescription>
                        {mode === 'create'
                            ? 'Cadastre uma nova contratante no painel administrativo.'
                            : mode === 'edit'
                              ? 'Atualize os dados basicos da contratante selecionada.'
                              : 'Visualize os dados da contratante selecionada.'}
                    </SheetDescription>
                </SheetHeader>

                {mode === 'view' && contractor !== null ? (
                    <div className="flex h-full flex-col overflow-hidden">
                        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                            <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="rounded-full border border-border/70 bg-background p-2">
                                        <FileText className="size-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {contractor.name}
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
                                            {contractor.name}
                                        </dd>
                                    </div>
                                    <div className="space-y-1">
                                        <dt className="text-sm font-medium text-muted-foreground">
                                            CNPJ
                                        </dt>
                                        <dd className="text-sm font-medium">
                                            {formatCnpj(contractor.cnpj)}
                                        </dd>
                                    </div>
                                    <div className="space-y-1">
                                        <dt className="text-sm font-medium text-muted-foreground">
                                            Status
                                        </dt>
                                        <dd>
                                            <Badge
                                                variant={
                                                    contractor.active
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                            >
                                                {contractor.active
                                                    ? 'Ativo'
                                                    : 'Inativo'}
                                            </Badge>
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        <div className="border-t px-6 py-4">
                            <Button onClick={() => onEdit(contractor)}>
                                <Pencil />
                                Editar contractor
                            </Button>
                        </div>
                    </div>
                ) : (
                    <ContractorForm
                        key={`${mode}-${contractor?.id ?? 'new'}`}
                        action={
                            mode === 'create' || contractor === null
                                ? ContractorController.store()
                                : ContractorController.update(contractor.id)
                        }
                        contractor={formContractor}
                        submitLabel={
                            mode === 'create'
                                ? 'Criar contractor'
                                : 'Salvar alterações'
                        }
                        onSuccess={onSuccess}
                    />
                )}
            </SheetContent>
        </Sheet>
    );
}
