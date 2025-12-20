export type Pagination = {
  page: number;
  limit: number;
  total: number;
};

export type PaginatedResult<T> = {
  data: T[];
  pagination: Pagination;
};
