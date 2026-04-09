import { FileText, Pencil } from 'lucide-react';
import type { ComponentProps } from 'react';
import ManagerController from '@/actions/App/Http/Controllers/Admin/ManagerController';
import ManagerForm from '@/components/managers/manager-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import type {
    ContractorOption,
    ManagerRow,
    SheetMode,
} from '@/types';

type ManagerSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: SheetMode;
    manager: ManagerRow | null;
    contractors: ContractorOption[];
    onEdit: (manager: ManagerRow) => void;
    onSuccess: () => void;
};

type ManagerFormProps = ComponentProps<typeof ManagerForm>;

export function ManagerSheet({
    open,
    onOpenChange,
    mode,
    manager,
    contractors,
    onEdit,
    onSuccess,
}: ManagerSheetProps) {
    const formManager: ManagerFormProps['manager'] =
        manager === null
            ? {
                  name: '',
                  email: '',
                  active: true,
                  contractor_id: '',
              }
            : {
                  id: manager.id,
                  name: manager.name,
                  email: manager.email,
                  active: manager.active,
                  contractor_id: String(
                      manager.manager_profile?.contractor?.id ?? '',
                  ),
              };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full gap-0 sm:max-w-xl">
                <SheetHeader className="border-b px-6 py-6 pr-14">
                    <SheetTitle>
                        {mode === 'create'
                            ? 'Novo gestor'
                            : mode === 'edit'
                              ? 'Editar gestor'
                              : 'Detalhes do gestor'}
                    </SheetTitle>
                    <SheetDescription>
                        {mode === 'create'
                            ? 'Cadastre um novo gestor no painel administrativo.'
                            : mode === 'edit'
                              ? 'Atualize os dados basicos do gestor selecionado.'
                              : 'Visualize os dados do gestor selecionado.'}
                    </SheetDescription>
                </SheetHeader>

                {mode === 'view' && manager !== null ? (
                    <div className="flex h-full flex-col overflow-hidden">
                        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                            <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="rounded-full border border-border/70 bg-background p-2">
                                        <FileText className="size-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {manager.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Gestor administrativo
                                        </p>
                                    </div>
                                </div>

                                <dl className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <dt className="text-sm font-medium text-muted-foreground">
                                            Nome
                                        </dt>
                                        <dd className="text-sm font-medium">
                                            {manager.name}
                                        </dd>
                                    </div>
                                    <div className="space-y-1">
                                        <dt className="text-sm font-medium text-muted-foreground">
                                            Email
                                        </dt>
                                        <dd className="text-sm font-medium">
                                            {manager.email}
                                        </dd>
                                    </div>
                                    <div className="space-y-1">
                                        <dt className="text-sm font-medium text-muted-foreground">
                                            Contratante vinculada
                                        </dt>
                                        <dd className="text-sm font-medium">
                                            {manager.manager_profile?.contractor
                                                ?.name ?? 'Nao vinculado'}
                                        </dd>
                                    </div>
                                    <div className="space-y-1">
                                        <dt className="text-sm font-medium text-muted-foreground">
                                            Status
                                        </dt>
                                        <dd>
                                            <Badge
                                                variant={
                                                    manager.active
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                            >
                                                {manager.active
                                                    ? 'Ativo'
                                                    : 'Inativo'}
                                            </Badge>
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        <div className="border-t px-6 py-4">
                            <Button onClick={() => onEdit(manager)}>
                                <Pencil />
                                Editar gestor
                            </Button>
                        </div>
                    </div>
                ) : (
                    <ManagerForm
                        key={`${mode}-${manager?.id ?? 'new'}`}
                        action={
                            mode === 'create' || manager === null
                                ? ManagerController.store()
                                : ManagerController.update(manager.id)
                        }
                        manager={formManager}
                        mode={mode}
                        contractors={contractors}
                        submitLabel={
                            mode === 'create'
                                ? 'Criar gestor'
                                : 'Salvar alterações'
                        }
                        onSuccess={onSuccess}
                    />
                )}
            </SheetContent>
        </Sheet>
    );
}
