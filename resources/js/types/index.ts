export type LaravelPaginator<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};

export type * from './auth';
export type * from './navigation';
export type * from './ui';
export type * from './contractors';
export type * from './managers';
