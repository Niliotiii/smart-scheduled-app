
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
  userEmail: string;
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
  Viewer = 1,
  Editor = 2,
  Leader = 3,
}
