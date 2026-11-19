export type PageResponse<T> = {
    content: T[],
    page: {
        size: number,
        number: number,
        totalElements: number,
        totalPages: number
    }
}