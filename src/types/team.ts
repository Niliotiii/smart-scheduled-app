
export interface Team {
  id: number;
  name: string;
  description: string;
}

export interface TeamMember {
  id: number;
  userId: number;
  username: string;
  role: string;
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
