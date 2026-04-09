export type HealthUnitType = 'ubs' | 'upa' | 'hospital';

export type HealthUnitComplexity = 'low' | 'medium' | 'high';

export type HealthUnitRow = {
    id: number;
    name: string;
    type: HealthUnitType;
    complexity: HealthUnitComplexity;
    city: string;
    state: string;
    active: boolean;
    contractor: { id: number; name: string } | null;
    cnpj: string;
    zip_code: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
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

export type HealthUnitFilters = {
    search_name: string;
    search_city: string;
    search_type: string;
    contractor_id: string;
    status: string;
    sort: 'name' | 'type' | 'city' | 'complexity' | 'active';
    direction: 'asc' | 'desc';
};

export type OperatingDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
