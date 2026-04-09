import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { formatCnpjMask, formatZipCodeMask } from '@/lib/formatters';
import type {
    ContractorOption,
    OperatingDay,
    SheetMode,
} from '@/types';
import type { RouteDefinition } from '@/wayfinder';

type HealthUnitFormProps = {
    action: RouteDefinition<'post' | 'patch'>;
    healthUnit: {
        id?: number;
        name: string;
        type: string;
        cnpj: string;
        complexity: string;
        active: boolean;
        contractor_id: string;
        zip_code: string;
        street: string;
        number: string;
        complement: string;
        neighborhood: string;
        city: string;
        state: string;
        latitude: string;
        longitude: string;
        serves_adult: boolean;
        serves_pediatric: boolean;
        serves_gyneco: boolean;
        serves_neurology: boolean;
        serves_cardiology: boolean;
        serves_orthopedics: boolean;
        opening_time: string;
        closing_time: string;
        operating_days: OperatingDay[];
        daily_capacity: string;
    };
    mode: SheetMode;
    contractors: ContractorOption[];
    isAdmin: boolean;
    submitLabel: string;
    onSuccess?: () => void;
};

const healthUnitTypeOptions = [
    { value: 'ubs', label: 'UBS' },
    { value: 'upa', label: 'UPA' },
    { value: 'hospital', label: 'Hospital' },
] as const;

const healthUnitComplexityOptions = [
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
] as const;

const operatingDayOptions: Array<{ value: OperatingDay; label: string }> = [
    { value: 'mon', label: 'Seg' },
    { value: 'tue', label: 'Ter' },
    { value: 'wed', label: 'Qua' },
    { value: 'thu', label: 'Qui' },
    { value: 'fri', label: 'Sex' },
    { value: 'sat', label: 'Sáb' },
    { value: 'sun', label: 'Dom' },
];

function SectionTitle({ title }: { title: string }) {
    return (
        <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">{title}</p>
            <Separator />
        </div>
    );
}

export default function HealthUnitForm({
    action,
    healthUnit,
    mode,
    contractors,
    isAdmin,
    submitLabel,
    onSuccess,
}: HealthUnitFormProps) {
    const [cepLoading, setCepLoading] = useState(false);
    const [cepError, setCepError] = useState('');

    const form = useForm({
        name: healthUnit.name,
        type: healthUnit.type,
        cnpj: healthUnit.cnpj,
        complexity: healthUnit.complexity,
        active: healthUnit.active,
        contractor_id: healthUnit.contractor_id,
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
    });

    useEffect(() => {
        form.setData({
            name: healthUnit.name,
            type: healthUnit.type,
            cnpj: healthUnit.cnpj,
            complexity: healthUnit.complexity,
            active: healthUnit.active,
            contractor_id: healthUnit.contractor_id,
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
        });
        form.clearErrors();
        form.setDefaults({
            name: healthUnit.name,
            type: healthUnit.type,
            cnpj: healthUnit.cnpj,
            complexity: healthUnit.complexity,
            active: healthUnit.active,
            contractor_id: healthUnit.contractor_id,
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
        });
        setCepError('');
        setCepLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        healthUnit.id,
        healthUnit.name,
        healthUnit.type,
        healthUnit.cnpj,
        healthUnit.complexity,
        healthUnit.active,
        healthUnit.contractor_id,
        healthUnit.zip_code,
        healthUnit.street,
        healthUnit.number,
        healthUnit.complement,
        healthUnit.neighborhood,
        healthUnit.city,
        healthUnit.state,
        healthUnit.latitude,
        healthUnit.longitude,
        healthUnit.serves_adult,
        healthUnit.serves_pediatric,
        healthUnit.serves_gyneco,
        healthUnit.serves_neurology,
        healthUnit.serves_cardiology,
        healthUnit.serves_orthopedics,
        healthUnit.opening_time,
        healthUnit.closing_time,
        healthUnit.daily_capacity,
        healthUnit.operating_days.join('|'),
    ]);

    const fetchZipCodeData = async (): Promise<void> => {
        const digits = form.data.zip_code.replace(/\D/g, '');

        if (digits.length !== 8) {
            return;
        }

        setCepLoading(true);
        setCepError('');

        try {
            const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
            const payload: {
                erro?: boolean;
                logradouro?: string;
                bairro?: string;
                localidade?: string;
                uf?: string;
            } = await response.json();

            if (!response.ok || payload.erro) {
                setCepError('CEP não encontrado');
                return;
            }

            form.setData('street', payload.logradouro ?? '');
            form.setData('neighborhood', payload.bairro ?? '');
            form.setData('city', payload.localidade ?? '');
            form.setData('state', payload.uf ?? '');
        } catch {
            setCepError('CEP não encontrado');
        } finally {
            setCepLoading(false);
        }
    };

    return (
        <form
            className="flex h-full flex-col overflow-hidden"
            onSubmit={(event) => {
                event.preventDefault();

                form.submit(action, {
                    preserveScroll: true,
                    onSuccess: () => {
                        onSuccess?.();
                    },
                });
            }}
        >
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                <SectionTitle title="Identificação" />

                <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                        id="name"
                        value={form.data.name}
                        onChange={(event) =>
                            form.setData('name', event.target.value)
                        }
                        placeholder="Nome da unidade de saúde"
                    />
                    <InputError message={form.errors.name} />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="type">Tipo</Label>
                        <Select
                            value={form.data.type}
                            onValueChange={(value) => form.setData('type', value)}
                        >
                            <SelectTrigger id="type" className="w-full">
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent align="start">
                                {healthUnitTypeOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.type} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="complexity">Complexidade</Label>
                        <Select
                            value={form.data.complexity}
                            onValueChange={(value) =>
                                form.setData('complexity', value)
                            }
                        >
                            <SelectTrigger id="complexity" className="w-full">
                                <SelectValue placeholder="Selecione a complexidade" />
                            </SelectTrigger>
                            <SelectContent align="start">
                                {healthUnitComplexityOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.complexity} />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                        id="cnpj"
                        value={form.data.cnpj}
                        onChange={(event) =>
                            form.setData(
                                'cnpj',
                                formatCnpjMask(event.target.value),
                            )
                        }
                        placeholder="00.000.000/0000-00"
                    />
                    <InputError message={form.errors.cnpj} />
                </div>

                {isAdmin ? (
                    <div className="grid gap-2">
                        <Label htmlFor="contractor_id">Contratante</Label>
                        <Select
                            value={form.data.contractor_id}
                            onValueChange={(value) =>
                                form.setData('contractor_id', value)
                            }
                        >
                            <SelectTrigger id="contractor_id" className="w-full">
                                <SelectValue placeholder="Selecione uma contratante" />
                            </SelectTrigger>
                            <SelectContent align="start">
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
                        <InputError message={form.errors.contractor_id} />
                    </div>
                ) : null}

                {mode === 'edit' ? (
                    <>
                        <div className="flex items-start gap-3 rounded-lg border border-border/70 p-4">
                            <Switch
                                id="active"
                                checked={form.data.active}
                                onCheckedChange={(checked) =>
                                    form.setData('active', checked)
                                }
                            />

                            <div className="grid gap-1">
                                <Label htmlFor="active">
                                    {form.data.active ? 'Ativa' : 'Inativa'}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Unidades inativas permanecem cadastradas,
                                    mas ficam sinalizadas na listagem.
                                </p>
                            </div>
                        </div>
                        <InputError message={form.errors.active} />
                    </>
                ) : null}

                <SectionTitle title="Endereço" />

                <div className="grid gap-2">
                    <Label htmlFor="zip_code">CEP</Label>
                    <Input
                        id="zip_code"
                        value={form.data.zip_code}
                        disabled={cepLoading}
                        onChange={(event) => {
                            setCepError('');
                            form.setData(
                                'zip_code',
                                formatZipCodeMask(event.target.value),
                            );
                        }}
                        onBlur={() => {
                            if (form.data.zip_code.length === 9) {
                                void fetchZipCodeData();
                            }
                        }}
                        placeholder={cepLoading ? 'Buscando...' : '00000-000'}
                    />
                    <InputError message={cepError || form.errors.zip_code} />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="grid gap-2 sm:col-span-2">
                        <Label htmlFor="street">Logradouro</Label>
                        <Input
                            id="street"
                            value={form.data.street}
                            onChange={(event) =>
                                form.setData('street', event.target.value)
                            }
                            placeholder="Rua, avenida, travessa"
                        />
                        <InputError message={form.errors.street} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="number">Número</Label>
                        <Input
                            id="number"
                            value={form.data.number}
                            onChange={(event) =>
                                form.setData('number', event.target.value)
                            }
                            placeholder="Ex: 120"
                        />
                        <InputError message={form.errors.number} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input
                            id="complement"
                            value={form.data.complement}
                            onChange={(event) =>
                                form.setData('complement', event.target.value)
                            }
                            placeholder="Opcional"
                        />
                        <InputError message={form.errors.complement} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="neighborhood">Bairro</Label>
                        <Input
                            id="neighborhood"
                            value={form.data.neighborhood}
                            onChange={(event) =>
                                form.setData('neighborhood', event.target.value)
                            }
                            placeholder="Bairro"
                        />
                        <InputError message={form.errors.neighborhood} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                            id="city"
                            value={form.data.city}
                            onChange={(event) =>
                                form.setData('city', event.target.value)
                            }
                            placeholder="Cidade"
                        />
                        <InputError message={form.errors.city} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input
                            id="state"
                            maxLength={2}
                            value={form.data.state}
                            onChange={(event) =>
                                form.setData(
                                    'state',
                                    event.target.value.toUpperCase(),
                                )
                            }
                            placeholder="UF"
                        />
                        <InputError message={form.errors.state} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                            id="latitude"
                            type="number"
                            step="any"
                            value={form.data.latitude}
                            onChange={(event) =>
                                form.setData('latitude', event.target.value)
                            }
                            placeholder="Opcional"
                        />
                        <InputError message={form.errors.latitude} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                            id="longitude"
                            type="number"
                            step="any"
                            value={form.data.longitude}
                            onChange={(event) =>
                                form.setData('longitude', event.target.value)
                            }
                            placeholder="Opcional"
                        />
                        <InputError message={form.errors.longitude} />
                    </div>
                </div>

                <SectionTitle title="Configuração assistencial" />

                <div className="grid grid-cols-2 gap-3">
                    {[
                        ['serves_adult', 'Adulto'],
                        ['serves_pediatric', 'Pediátrico'],
                        ['serves_gyneco', 'Gineco-Obstétrico'],
                        ['serves_neurology', 'Neurologia'],
                        ['serves_cardiology', 'Cardiologia'],
                        ['serves_orthopedics', 'Ortopedia'],
                    ].map(([field, label]) => (
                        <label
                            key={field}
                            htmlFor={field}
                            className="flex items-start gap-3 rounded-lg border border-border/70 p-3"
                        >
                            <Checkbox
                                id={field}
                                checked={
                                    form.data[
                                        field as keyof typeof form.data
                                    ] as boolean
                                }
                                onCheckedChange={(checked) =>
                                    form.setData(
                                        field as
                                            | 'serves_adult'
                                            | 'serves_pediatric'
                                            | 'serves_gyneco'
                                            | 'serves_neurology'
                                            | 'serves_cardiology'
                                            | 'serves_orthopedics',
                                        checked === true,
                                    )
                                }
                            />
                            <span className="text-sm font-medium">{label}</span>
                        </label>
                    ))}
                </div>
                <InputError
                    message={
                        form.errors.serves_adult ??
                        form.errors.serves_pediatric ??
                        form.errors.serves_gyneco ??
                        form.errors.serves_neurology ??
                        form.errors.serves_cardiology ??
                        form.errors.serves_orthopedics
                    }
                />

                <SectionTitle title="Funcionamento" />

                <div className="grid gap-2">
                    <Label>Dias de funcionamento</Label>
                    <ToggleGroup
                        type="multiple"
                        value={form.data.operating_days}
                        onValueChange={(value) =>
                            form.setData('operating_days', value as OperatingDay[])
                        }
                        className="flex flex-wrap justify-start gap-2"
                    >
                        {operatingDayOptions.map((day) => (
                            <ToggleGroupItem
                                key={day.value}
                                value={day.value}
                                variant="outline"
                                className="rounded-md px-2 text-xs"
                            >
                                {day.label}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                    <InputError message={form.errors.operating_days} />
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                    <div className="grid gap-2">
                        <Label htmlFor="opening_time">Abertura</Label>
                        <Input
                            id="opening_time"
                            type="time"
                            value={form.data.opening_time}
                            onChange={(event) =>
                                form.setData('opening_time', event.target.value)
                            }
                        />
                        <InputError message={form.errors.opening_time} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="closing_time">Fechamento</Label>
                        <Input
                            id="closing_time"
                            type="time"
                            value={form.data.closing_time}
                            onChange={(event) =>
                                form.setData('closing_time', event.target.value)
                            }
                        />
                        <InputError message={form.errors.closing_time} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="daily_capacity">Capacidade diária</Label>
                        <Input
                            id="daily_capacity"
                            type="number"
                            min="1"
                            value={form.data.daily_capacity}
                            onChange={(event) =>
                                form.setData('daily_capacity', event.target.value)
                            }
                            placeholder="Ex: 50"
                        />
                        <InputError message={form.errors.daily_capacity} />
                    </div>
                </div>
            </div>

            <div className="border-t px-6 py-4">
                <Button type="submit" disabled={form.processing || cepLoading}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
