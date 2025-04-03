export interface RolePermissions {
  ViewTeams: boolean;
  CreateTeams: boolean;
  EditTeams: boolean;
  DeleteTeams: boolean;
  ViewUsers: boolean;
  CreateUsers: boolean;
  EditUsers: boolean;
  DeleteUsers: boolean;
  ViewOwnUser: boolean;
  EditOwnUser: boolean;
  ManageOwnInvites: boolean;
  ViewOwnTeams: boolean;
  ManageSystem: boolean;
}

export interface TeamRulePermissions {
  ViewTeam: boolean;
  EditTeam: boolean;
  CreateAssignments: boolean;
  EditAssignments: boolean;
  DeleteAssignments: boolean; // Add this permission
  ViewAssignments: boolean;
  ManageInvites: boolean;
  CreateSchedules: boolean;
  EditSchedules: boolean;
  DeleteSchedules: boolean;
  ViewSchedules: boolean;
  ManageTeamSettings: boolean;
}

export interface RenderPermissions {
  rolePermissions: RolePermissions;
  teamRulePermissions: TeamRulePermissions;
}
