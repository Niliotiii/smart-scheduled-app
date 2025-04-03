
export interface Assignment {
  id: number;
  teamId: number;
  title: string;
  description: string;
  status?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentCreateRequest {
  title: string;
  description: string;
}

export interface AssignmentUpdateRequest {
  title: string;
  description: string;
}

export interface AssignmentResponse {
  success: boolean;
  message: string;
  data: {
    $id: string;
    $values: Assignment[];
  };
}

export interface SingleAssignmentResponse {
  success: boolean;
  message: string;
  data: Assignment;
}

export interface AssignmentMembersResponse {
  success: boolean;
  message: string;
  data: {
    $id: string;
    $values: AssignmentMember[];
  };
}

export interface AssignmentMember {
  $id: string;
  name: string;
  email: string;
  roleName: string;
}
