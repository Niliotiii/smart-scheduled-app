
export interface Invite {
  id: number;
  teamId: number;
  teamName: string;
  userId: number;
  userName: string;
  teamRule: number;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface InviteCreateRequest {
  teamId: number;
  userId: number;
  teamRule: number;
}

export interface InviteResponse {
  success: boolean;
  message: string;
  data: {
    $id: string;
    $values: Invite[];
  };
}

export interface SingleInviteResponse {
  success: boolean;
  message: string;
  data: Invite;
}

export enum TeamRule {
  Viewer = 0,
  Member = 1,
  Leader = 2,
  Admin = 3
}
