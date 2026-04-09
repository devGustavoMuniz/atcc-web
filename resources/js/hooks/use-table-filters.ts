import { router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

type TableFilters = {
    search_name: string;
    search_cnpj: string;
    status: string;
    sort: 'name' | 'cnpj' | 'active';
    direction: 'asc' | 'desc';
};

type UseTableFiltersOptions = {
    initialFilters: Partial<TableFilters>;
    url: string;
};

function normalizeFilters(filters: Partial<TableFilters>): TableFilters {
    return {
        search_name: filters.search_name ?? '',
        search_cnpj: filters.search_cnpj ?? '',
        status: filters.status ?? '',
        sort: filters.sort ?? 'name',
        direction: filters.direction ?? 'asc',
    };
}

function buildQuery(filters: TableFilters): Record<string, string> {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== ''),
    ) as Record<string, string>;
}

function buildFilterKey(filters: TableFilters): string {
    return JSON.stringify(filters);
}

export function useTableFilters({
    initialFilters,
    url,
}: UseTableFiltersOptions) {
    const [filters, setFilters] = useState<TableFilters>(() => normalizeFilters(initialFilters));
    const [debouncedSearchName, setDebouncedSearchName] = useState(filters.search_name);
    const [debouncedSearchCnpj, setDebouncedSearchCnpj] = useState(filters.search_cnpj);
    const isFirstRender = useRef(true);
    const serverFilterKey = buildFilterKey(normalizeFilters(initialFilters));

    useEffect(() => {
        const nextFilters = normalizeFilters(initialFilters);

        setFilters(nextFilters);
        setDebouncedSearchName(nextFilters.search_name);
        setDebouncedSearchCnpj(nextFilters.search_cnpj);
    }, [
        initialFilters.direction,
        initialFilters.search_cnpj,
        initialFilters.search_name,
        initialFilters.sort,
        initialFilters.status,
    ]);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setDebouncedSearchName(filters.search_name);
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [filters.search_name]);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setDebouncedSearchCnpj(filters.search_cnpj);
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [filters.search_cnpj]);

    const appliedFilters = useMemo<TableFilters>(() => ({
        ...filters,
        search_name: debouncedSearchName,
        search_cnpj: debouncedSearchCnpj,
    }), [debouncedSearchCnpj, debouncedSearchName, filters]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        if (buildFilterKey(appliedFilters) === serverFilterKey) {
            return;
        }

        router.get(url, buildQuery(appliedFilters), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, [appliedFilters, serverFilterKey, url]);

    const handleFilterChange = (key: keyof TableFilters, value: string): void => {
        setFilters((currentFilters) => ({
            ...currentFilters,
            [key]: value,
        }));
    };

    const handleSortChange = (column: TableFilters['sort']): void => {
        setFilters((currentFilters) => ({
            ...currentFilters,
            sort: column,
            direction:
                currentFilters.sort === column && currentFilters.direction === 'asc'
                    ? 'desc'
                    : 'asc',
        }));
    };

    return {
        filters,
        handleFilterChange,
        handleSortChange,
    };
}
