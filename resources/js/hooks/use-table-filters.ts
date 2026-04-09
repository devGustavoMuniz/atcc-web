import { router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

type UseTableFiltersOptions<TFilters extends Record<string, string>> = {
    initialFilters: TFilters;
    url: string;
    debounceFields?: Array<keyof TFilters>;
};

type TableFilterState<TFilters extends Record<string, string>> = {
    sourceKey: string;
    filters: TFilters;
    debouncedFilters: Partial<TFilters>;
};

function normalizeFilters<TFilters extends Record<string, string>>(
    filters: TFilters,
): TFilters {
    return { ...filters };
}

function buildQuery<TFilters extends Record<string, string>>(
    filters: TFilters,
): Record<string, string> {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== ''),
    ) as Record<string, string>;
}

function buildFilterKey<TFilters extends Record<string, string>>(
    filters: TFilters,
): string {
    return JSON.stringify(filters);
}

function getDefaultDebounceFields<TFilters extends Record<string, string>>(
    filters: TFilters,
): Array<keyof TFilters> {
    return Object.keys(filters).filter((field) =>
        field.startsWith('search_'),
    ) as Array<keyof TFilters>;
}

function getDebouncedValues<TFilters extends Record<string, string>>(
    filters: TFilters,
    debounceFields: Array<keyof TFilters>,
): Partial<TFilters> {
    return Object.fromEntries(
        debounceFields.map((field) => [field, filters[field]]),
    ) as Partial<TFilters>;
}

function createTableFilterState<TFilters extends Record<string, string>>(
    filters: TFilters,
    debounceFields: Array<keyof TFilters>,
): TableFilterState<TFilters> {
    return {
        sourceKey: buildFilterKey(filters),
        filters,
        debouncedFilters: getDebouncedValues(filters, debounceFields),
    };
}

export function useTableFilters<TFilters extends Record<string, string>>({
    initialFilters,
    url,
    debounceFields,
}: UseTableFiltersOptions<TFilters>) {
    const initialFiltersKey = JSON.stringify(initialFilters);
    const normalizedInitialFilters = useMemo(
        () => normalizeFilters(initialFilters),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [initialFiltersKey],
    );
    const debounceFieldKey = JSON.stringify(debounceFields ?? []);
    const resolvedDebounceFields = useMemo(
        () =>
            debounceFields ?? getDefaultDebounceFields(normalizedInitialFilters),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [debounceFieldKey, normalizedInitialFilters],
    );
    const serverFilterKey = buildFilterKey(normalizedInitialFilters);
    const [tableFilterState, setTableFilterState] =
        useState<TableFilterState<TFilters>>(() =>
            createTableFilterState(
                normalizedInitialFilters,
                resolvedDebounceFields,
            ),
        );
    const currentState = useMemo(
        () =>
            tableFilterState.sourceKey === serverFilterKey
                ? tableFilterState
                : createTableFilterState(
                      normalizedInitialFilters,
                      resolvedDebounceFields,
                  ),
        [
            normalizedInitialFilters,
            resolvedDebounceFields,
            serverFilterKey,
            tableFilterState,
        ],
    );
    const filters = currentState.filters;
    const debouncedFilters = currentState.debouncedFilters;
    const isFirstRender = useRef(true);

    useEffect(() => {
        const timeouts = resolvedDebounceFields.map((field) =>
            window.setTimeout(() => {
                setTableFilterState((currentTableFilterState) => {
                    const nextState =
                        currentTableFilterState.sourceKey === serverFilterKey
                            ? currentTableFilterState
                            : createTableFilterState(
                                  normalizedInitialFilters,
                                  resolvedDebounceFields,
                              );

                    if (
                        nextState.debouncedFilters[field] ===
                        nextState.filters[field]
                    ) {
                        return nextState;
                    }

                    return {
                        ...nextState,
                        debouncedFilters: {
                            ...nextState.debouncedFilters,
                            [field]: nextState.filters[field],
                        },
                    };
                });
            }, 300),
        );

        return () => {
            timeouts.forEach((timeout) => window.clearTimeout(timeout));
        };
    }, [
        debounceFieldKey,
        filters,
        normalizedInitialFilters,
        resolvedDebounceFields,
        serverFilterKey,
    ]);

    const appliedFilters = useMemo<TFilters>(
        () =>
            ({
                ...filters,
                ...debouncedFilters,
            }) as TFilters,
        [debouncedFilters, filters],
    );

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

    const handleFilterChange = (key: keyof TFilters, value: string): void => {
        setTableFilterState((currentTableFilterState) => {
            const nextState =
                currentTableFilterState.sourceKey === serverFilterKey
                    ? currentTableFilterState
                    : createTableFilterState(
                          normalizedInitialFilters,
                          resolvedDebounceFields,
                      );

            return {
                ...nextState,
                filters: {
                    ...nextState.filters,
                    [key]: value,
                } as TFilters,
            };
        });
    };

    const handleSortChange = (column: TFilters['sort']): void => {
        setTableFilterState((currentTableFilterState) => {
            const nextState =
                currentTableFilterState.sourceKey === serverFilterKey
                    ? currentTableFilterState
                    : createTableFilterState(
                          normalizedInitialFilters,
                          resolvedDebounceFields,
                      );

            return {
                ...nextState,
                filters: {
                    ...nextState.filters,
                    sort: column,
                    direction:
                        nextState.filters.sort === column &&
                        nextState.filters.direction === 'asc'
                            ? 'desc'
                            : 'asc',
                } as TFilters,
            };
        });
    };

    return {
        filters,
        handleFilterChange,
        handleSortChange,
    };
}
