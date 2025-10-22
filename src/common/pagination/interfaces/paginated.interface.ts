export interface Paginated<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPage: number;
  };
  links: {
    firts: string;
    last: string;
    current: string;
    next: string;
    previous: string;
  };
}
