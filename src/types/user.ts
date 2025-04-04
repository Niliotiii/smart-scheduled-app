
export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  cpf?: string;
  cellphone?: string;
  motherName?: string;
  fatherName?: string;
  motherCellphone?: string;
  fatherCellphone?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  cpf: string;
  cellphone: string;
  motherName: string;
  fatherName: string;
  motherCellphone: string;
  fatherCellphone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserCreateRequest {
  username: string;
  password: string;
  email: string;
  name: string;
  cpf?: string;
  cellphone?: string;
  motherName?: string;
  fatherName?: string;
  motherCellphone?: string;
  fatherCellphone?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  cpf?: string;
  cellphone?: string;
  motherName?: string;
  fatherName?: string;
  motherCellphone?: string;
  fatherCellphone?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface UserResponse {
  $id: string;
  success: boolean;
  message: string;
  data: {
    $id: string;
    $values: User[];
  };
}

export interface TeamResponse {
  $id: string;
  success: boolean;
  message: string;
  data: {
    $id: string;
    $values: any[];
  };
}

export interface PermissionResponse {
  $id: string;
  success: boolean;
  message: string;
  data: {
    $id: string;
    $values: any[];
  };
}

export interface ScheduleResponse {
  $id: string;
  success: boolean;
  message: string;
  data: {
    $id: string;
    $values: any[];
  };
}
