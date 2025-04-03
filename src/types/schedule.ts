
export interface Schedule {
  id: number;
  teamId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleCreateRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface ScheduleUpdateRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface ScheduleResponse {
  success: boolean;
  message: string;
  data: {
    $id: string;
    $values: Schedule[];
  };
}

export interface SingleScheduleResponse {
  success: boolean;
  message: string;
  data: Schedule;
}
