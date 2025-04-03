export interface Assignment {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  teamId: number;
  teamName: string;
}

export interface AssignmentCreateRequest {
  title: string;
  description: string;
}

export interface AssignmentUpdateRequest {
  title: string;
  description: string;
}

export interface ApiResponse<T> {
  $id: string;
  success: boolean;
  message: string;
  data: {
    $id: string;
    $values: T[];
  };
}

export interface SingleApiResponse<T> {
  $id: string;
  success: boolean;
  message: string;
  data: T;
}

export interface AssignmentResponse extends ApiResponse<Assignment> {}

export interface SingleAssignmentResponse
  extends SingleApiResponse<Assignment> {}

export interface AssignmentMember {
  $id: string;
  name: string;
  email: string;
  roleName: string;
}

export interface AssignmentMembersResponse
  extends ApiResponse<AssignmentMember> {}
