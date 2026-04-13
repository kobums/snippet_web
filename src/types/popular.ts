export interface PopularBookDto {
  rank: number;
  title: string;
  author: string;
  publisher: string;
  isbn13: string;
  kdc: string;
  kdcName: string;
  loanCount: number;
  coverUrl: string;
}

export interface PopularBooksParams {
  startDt?: string;
  endDt?: string;
  kdc?: string;
  dtlKdc?: string;
  age?: string;
  gender?: string;
  region?: string;
  dtlRegion?: string;
  pageNo?: number;
  pageSize?: number;
}
