export type Paginated<T> = {
    data: T;
    total: number;
    hasMore: boolean;
}