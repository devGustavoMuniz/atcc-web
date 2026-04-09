import { FileText, Pencil } from 'lucide-react';
import type { ComponentProps } from 'react';
import AdminHealthUnitController from '@/actions/App/Http/Controllers/Admin/HealthUnitController';
import ManagerHealthUnitController from '@/actions/App/Http/Controllers/Manager/HealthUnitController';
import HealthUnitForm from '@/components/health-units/health-unit-form';
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
    HealthUnitRow,
    SheetMode,
} from '@/types';

type HealthUnitSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: SheetMode;
    healthUnit: HealthUnitRow | null;
    contractors: ContractorOption[];
    isAdmin: boolean;
    onEdit: (unit: HealthUnitRow) => void;
    onSuccess: () => void;
};

type HealthUnitFormProps = ComponentProps<typeof HealthUnitForm>;

const typeLabels = {
    ubs: 'UBS',
    upa: 'UPA',
    hospital: 'Hospital',
} as const;

const complexityLabels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
} as const;

export function HealthUnitSheet({
    open,
    onOpenChange,
    mode,
    healthUnit,
    contractors,
    isAdmin,
    onEdit,
    onSuccess,
}: HealthUnitSheetProps) {
    const formHealthUnit: HealthUnitFormProps['healthUnit'] =
        healthUnit === null
            ? {
                  name: '',
                  type: '',
                  cnpj: '',
                  complexity: '',
                  active: true,
                  contractor_id: '',
                  zip_code: '',
                  street: '',
                  number: '',
                  complement: '',
                  neighborhood: '',
                  city: '',
                  state: '',
                  latitude: '',
                  longitude: '',
                  serves_adult: true,
                  serves_pediatric: false,
                  serves_gyneco: false,
                  serves_neurology: false,
                  serves_cardiology: false,
                  serves_orthopedics: false,
                  opening_time: '',
                  closing_time: '',
                  operating_days: [],
                  daily_capacity: '',
              }
            : {
                  id: healthUnit.id,
                  name: healthUnit.name,
                  type: healthUnit.type,
                  cnpj: healthUnit.cnpj,
                  complexity: healthUnit.complexity,
                  active: healthUnit.active,
                  contractor_id: String(healthUnit.contractor?.id ?? ''),
                  zip_code: healthUnit.zip_code,
                  street: healthUnit.street,
                  number: healthUnit.number,
                  complement: healthUnit.complement,
                  neighborhood: healthUnit.neighborhood,
                  city: healthUnit.city,
                  state: healthUnit.state,
                  latitude: healthUnit.latitude,
                  longitude: healthUnit.longitude,
                  serves_adult: healthUnit.serves_adult,
                  serves_pediatric: healthUnit.serves_pediatric,
                  serves_gyneco: healthUnit.serves_gyneco,
                  serves_neurology: healthUnit.serves_neurology,
                  serves_cardiology: healthUnit.serves_cardiology,
                  serves_orthopedics: healthUnit.serves_orthopedics,
                  opening_time: healthUnit.opening_time,
                  closing_time: healthUnit.closing_time,
                  operating_days: healthUnit.operating_days,
                  daily_capacity: healthUnit.daily_capacity,
              };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full gap-0 sm:max-w-xl">
                <SheetHeader className="border-b px-6 py-6 pr-14">
                    <SheetTitle>
                        {mode === 'create'
                            ? 'Nova unidade de saúde'
                            : mode === 'edit'
                              ? 'Editar unidade de saúde'
                              : 'Detalhes da unidade de saúde'}
                    </SheetTitle>
                    <SheetDescription>
                        {mode === 'create'
                            ? 'Cadastre uma nova unidade de saúde.'
                            : mode === 'edit'
                              ? 'Atualize os dados da unidade selecionada.'
                              : 'Visualize os dados da unidade selecionada.'}
                    </SheetDescription>
                </SheetHeader>

                {mode === 'view' && healthUnit !== null ? (
                    <div className="flex h-full flex-col overflow-hidden">
                        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                            <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="rounded-full border border-border/70 bg-background p-2">
                                        <FileText className="size-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {healthUnit.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Unidade assistencial
                                        </p>
                                    </div>
                                </div>

                                <dl className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <dt className="text-sm font-medium text-muted-foreground">
                                            Nome
                                        </dt>
                                        <dd className="text-sm font-medium">
                                            {healthUnit.name}
                                        </dd>
                                    </div>
                                    <div className="space-y-1">
                                        <dt className="text-sm font-medium text-muted-foreground">
                                            Tipo
                                        </dt>
                                        <dd className="text-sm font-medium">
                                            {typeLabels[healthUnit.type]}
                                        </dd>
                                    </div>
                                    <div className="space-y-1">
                                        <dt className="text-sm font-medium text-muted-foreground">
                                            Cidade/Estado
                                        </dt>
                                        <dd className="text-sm font-medium">
                                            {healthUnit.city}/{healthUnit.state}
                                        </dd>
                                    </div>
                                    <div className="space-y-1">
                                        <dt className="text-sm font-medium text-muted-foreground">
                                            Complexidade
                                        </dt>
                                        <dd className="text-sm font-medium">
                                            {complexityLabels[healthUnit.complexity]}
                                        </dd>
                                    </div>
                                    {isAdmin ? (
                                        <div className="space-y-1">
                                            <dt className="text-sm font-medium text-muted-foreground">
                                                Contratante
                                            </dt>
                                            <dd className="text-sm font-medium">
                                                {healthUnit.contractor?.name ??
                                                    'Não vinculada'}
                                            </dd>
                                        </div>
                                    ) : null}
                                    <div className="space-y-1">
                                        <dt className="text-sm font-medium text-muted-foreground">
                                            Status
                                        </dt>
                                        <dd>
                                            <Badge
                                                variant={
                                                    healthUnit.active
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                            >
                                                {healthUnit.active
                                                    ? 'Ativa'
                                                    : 'Inativa'}
                                            </Badge>
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        <div className="border-t px-6 py-4">
                            <Button onClick={() => onEdit(healthUnit)}>
                                <Pencil />
                                Editar unidade
                            </Button>
                        </div>
                    </div>
                ) : (
                    <HealthUnitForm
                        key={`${mode}-${healthUnit?.id ?? 'new'}`}
                        action={
                            isAdmin
                                ? mode === 'create' || healthUnit === null
                                    ? AdminHealthUnitController.store()
                                    : AdminHealthUnitController.update(
                                          healthUnit.id,
                                      )
                                : mode === 'create' || healthUnit === null
                                  ? ManagerHealthUnitController.store()
                                  : ManagerHealthUnitController.update(
                                        healthUnit.id,
                                    )
                        }
                        healthUnit={formHealthUnit}
                        mode={mode}
                        contractors={contractors}
                        isAdmin={isAdmin}
                        submitLabel={
                            mode === 'create'
                                ? 'Criar unidade de saúde'
                                : 'Salvar alterações'
                        }
                        onSuccess={onSuccess}
                    />
                )}
            </SheetContent>
        </Sheet>
    );
}
