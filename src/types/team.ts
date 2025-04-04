
export interface Team {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  $id: string;
  name: string;
  email: string;
  roleName: string;
}

export interface TeamResponse {
  $id: string;
  success: boolean;
  message: string;
  data: {
    $id: string;
    $values: Team[];
  };
}

export interface TeamMembersResponse {
  $id: string;
  success: boolean;
  message: string;
  data: {
    $id: string;
    $values: TeamMember[];
  };
}
