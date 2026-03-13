export interface MonthlyStatsDto {
  month: number;
  completedCount: number;
  totalPages: number;
  categoryCount: Record<string, number>;
}

export interface YearlyStatsDto {
  year: number;
  completedCount: number;
  totalPages: number;
}

export interface CategoryStatsDto {
  category: string;
  totalCount: number;
  completedCount: number;
  completionRate: number;
}

export interface ReadingInsightsDto {
  averageReadingDays: number;
  topCategory: string;
  longestReadingDays: number;
  longestBook: string;
}
