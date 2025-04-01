
export interface Team {
  id: number;
  name: string;
  description: string;
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
