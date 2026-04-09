import { Head } from '@inertiajs/react';

type DashboardProps = {
    user: {
        id: number;
        name: string;
        role: string;
    };
};

export default function Dashboard({ user }: DashboardProps) {
    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 items-center justify-center rounded-xl border border-sidebar-border/70 p-8 dark:border-sidebar-border">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        Painel administrativo base para {user.name}.
                    </p>
                </div>
            </div>
        </>
    );
}
