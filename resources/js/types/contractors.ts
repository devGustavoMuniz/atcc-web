export type ContractorRow = {
    id: number;
    name: string;
    cnpj: string | null;
    active: boolean;
};

export type ContractorFilters = {
    search_name: string;
    search_cnpj: string;
    status: string;
    sort: 'name' | 'cnpj' | 'active';
    direction: 'asc' | 'desc';
};

export type SheetMode = 'create' | 'view' | 'edit';
