import { Building2, LayoutGrid } from 'lucide-react';
import { dashboard } from '@/routes';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as contractorsIndex } from '@/routes/admin/contractors';
import { dashboard as managerDashboard } from '@/routes/manager';
import type { NavItem } from '@/types';

export function getMainNavItems(role: string): NavItem[] {
    const dashboardItemByRole: Record<string, NavItem> = {
        admin: {
            title: 'Dashboard',
            href: adminDashboard(),
            icon: LayoutGrid,
        },
        gestor: {
            title: 'Dashboard',
            href: managerDashboard(),
            icon: LayoutGrid,
        },
        paciente: {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    };

    return [
        dashboardItemByRole[role] ?? dashboardItemByRole.paciente,
        ...(role === 'admin'
            ? [
                  {
                      title: 'Contractors',
                      href: contractorsIndex(),
                      icon: Building2,
                  },
              ]
            : []),
    ];
}
