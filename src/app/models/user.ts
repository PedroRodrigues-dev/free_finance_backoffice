export interface User {
  id: number;
  username: string;
  email: string;
  password: string | null;
  access_level: string;
  active: boolean;
}
