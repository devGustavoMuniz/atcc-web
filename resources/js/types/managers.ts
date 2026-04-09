export type ManagerRow = {
    id: number;
    name: string;
    email: string;
    active: boolean;
    manager_profile: {
        contractor: {
            id: number;
            name: string;
        } | null;
    } | null;
};

export type ManagerFilters = {
    search_name: string;
    search_email: string;
    contractor_id: string;
    status: string;
    sort: 'name' | 'email' | 'active';
    direction: 'asc' | 'desc';
};

export type ContractorOption = {
    id: number;
    name: string;
};
