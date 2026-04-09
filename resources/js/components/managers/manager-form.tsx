import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { ContractorOption, SheetMode } from '@/types';
import type { RouteDefinition } from '@/wayfinder';

type ManagerFormProps = {
    action: RouteDefinition<'post' | 'patch'>;
    manager: {
        id?: number;
        name: string;
        email: string;
        active: boolean;
        contractor_id: string;
    };
    mode: SheetMode;
    contractors: ContractorOption[];
    submitLabel: string;
    onSuccess?: () => void;
};

export default function ManagerForm({
    action,
    manager,
    mode,
    contractors,
    submitLabel,
    onSuccess,
}: ManagerFormProps) {
    const form = useForm({
        name: manager.name,
        email: manager.email,
        password: '',
        password_confirmation: '',
        contractor_id: manager.contractor_id,
        active: manager.active,
    });

    useEffect(() => {
        form.setData({
            name: manager.name,
            email: manager.email,
            password: '',
            password_confirmation: '',
            contractor_id: manager.contractor_id,
            active: manager.active,
        });
        form.clearErrors();
        form.setDefaults({
            name: manager.name,
            email: manager.email,
            password: '',
            password_confirmation: '',
            contractor_id: manager.contractor_id,
            active: manager.active,
        });
    }, [form, manager]);

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
                        onChange={(event) =>
                            form.setData('name', event.target.value)
                        }
                        placeholder="Nome do gestor"
                    />
                    <InputError message={form.errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={form.data.email}
                        onChange={(event) =>
                            form.setData('email', event.target.value)
                        }
                        placeholder="gestor@empresa.com"
                    />
                    <InputError message={form.errors.email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <PasswordInput
                        id="password"
                        value={form.data.password}
                        onChange={(event) => {
                            form.setData('password', event.target.value);
                            form.setData(
                                'password_confirmation',
                                event.target.value,
                            );
                        }}
                        placeholder={
                            mode === 'create'
                                ? 'Senha'
                                : 'Deixe em branco para manter a senha atual'
                        }
                    />
                    <InputError message={form.errors.password} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="contractor_id">Contractor</Label>
                    <Select
                        value={form.data.contractor_id}
                        onValueChange={(value) =>
                            form.setData('contractor_id', value)
                        }
                    >
                        <SelectTrigger id="contractor_id" className="w-full">
                            <SelectValue placeholder="Selecione um contractor" />
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
                                    {form.data.active ? 'Ativo' : 'Inativo'}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Gestores inativos permanecem cadastrados,
                                    mas ficam sinalizados na listagem.
                                </p>
                            </div>
                        </div>
                        <InputError message={form.errors.active} />
                    </>
                ) : null}
            </div>

            <div className="border-t px-6 py-4">
                <Button type="submit" disabled={form.processing}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
