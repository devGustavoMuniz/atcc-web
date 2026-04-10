import { Link, usePage } from '@inertiajs/react';
import { Activity, FileText, Telescope } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { getMainNavItems } from '@/config/nav';
import type { Auth, NavItem } from '@/types';

const adminDevToolsItems: NavItem[] = [
    {
        title: 'Telescope',
        href: '/telescope',
        icon: Telescope,
    },
    {
        title: 'Pulse',
        href: '/pulse',
        icon: Activity,
    },
    {
        title: 'Log Viewer',
        href: '/log-viewer',
        icon: FileText,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const mainNavItems = getMainNavItems(auth.user.role ?? '');
    const dashboardHref = mainNavItems[0]?.href ?? '#';
    const isAdmin = auth.user.role === 'admin';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {isAdmin && <NavFooter items={adminDevToolsItems} className="mt-auto" />}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
