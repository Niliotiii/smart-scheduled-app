
export interface Assigned {
  id: number;
  title: string;
  user: {
    id: number;
    name: string;
    email: string;
  }
  createdAt: string;
  updatedAt: string;
}

export interface AssignedCreateRequest {
  scheduledId: number;
  assignmentId: number;
  memberId: number;
}

export interface AssignedResponse {
  success: boolean;
  message: string;
  data: {
    $id: string;
    $values: Assigned[];
  };
}

export interface SingleAssignedResponse {
  success: boolean;
  message: string;
  data: Assigned;
}
