export interface Runner {
  id: number;
  bib: string;
  name: string;
  position: number;
  branch_position: number;
  category_position: number;
  laps: number;
  distance: number;
  mode: string;
  category: string;
  branch: string;
  club: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  recordsProcessed?: number;
}