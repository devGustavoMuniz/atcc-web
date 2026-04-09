import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function formatCnpj(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 14);

    if (digits.length <= 2) {
        return digits;
    }

    if (digits.length <= 5) {
        return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    }

    if (digits.length <= 8) {
        return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    }

    if (digits.length <= 12) {
        return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    }

    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

type ContractorFormProps = {
    action: any;
    contractor: {
        id?: number;
        name: string;
        cnpj: string | null;
        active: boolean;
    };
    submitLabel: string;
    onSuccess?: () => void;
};

export default function ContractorForm({
    action,
    contractor,
    submitLabel,
    onSuccess,
}: ContractorFormProps) {
    const form = useForm({
        name: contractor.name,
        cnpj: contractor.cnpj ?? '',
        active: contractor.active,
    });

    useEffect(() => {
        form.setData({
            name: contractor.name,
            cnpj: formatCnpj(contractor.cnpj ?? ''),
            active: contractor.active,
        });
        form.clearErrors();
        form.setDefaults({
            name: contractor.name,
            cnpj: formatCnpj(contractor.cnpj ?? ''),
            active: contractor.active,
        });
    }, [contractor]);

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
                <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                        id="name"
                        value={form.data.name}
                        onChange={(event) => form.setData('name', event.target.value)}
                        placeholder="Nome da contratante"
                    />
                    <InputError message={form.errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                        id="cnpj"
                        value={form.data.cnpj}
                        onChange={(event) => form.setData('cnpj', formatCnpj(event.target.value))}
                        placeholder="00.000.000/0000-00"
                    />
                    <InputError message={form.errors.cnpj} />
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-border/70 p-4">
                    <Checkbox
                        id="active"
                        checked={form.data.active}
                        onCheckedChange={(checked) => form.setData('active', checked === true)}
                    />

                    <div className="grid gap-1">
                        <Label htmlFor="active">Contractor ativo</Label>
                        <p className="text-sm text-muted-foreground">
                            Contractors inativos permanecem cadastrados, mas ficam sinalizados na listagem.
                        </p>
                    </div>
                </div>
                <InputError message={form.errors.active} />
            </div>

            <div className="border-t px-6 py-4">
                <Button type="submit" disabled={form.processing}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
